const { signupUser, verifyToken, generateAuthToken, loginUser } = require('../services/auth.services'); 
const { User } = require('../db/index'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../db/index'); 
jest.mock('jsonwebtoken'); 
jest.mock('bcrypt');

describe('signupUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user already exists', async () => {
    User.findOne.mockResolvedValueOnce({ email: 'test@example.com' });

    await expect(
      signupUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        role: 'Alumno',
        matricula: '12345',
        numeroTrabajador: null,
      })
    ).rejects.toThrow('User already exists.');
  });

  it('should throw an error for invalid role', async () => {
    User.findOne.mockResolvedValueOnce(null);

    await expect(
      signupUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        role: 'InvalidRole',
        matricula: '12345',
        numeroTrabajador: null,
      })
    ).rejects.toThrow("Invalid role. Valid roles are: Alumno, Jefatura, Control Escolar, Profesor.");
  });

  it('should throw an error if matricula is missing for Alumno', async () => {
    User.findOne.mockResolvedValueOnce(null);

    await expect(
      signupUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        role: 'Alumno',
        matricula: null,
        numeroTrabajador: null,
      })
    ).rejects.toThrow('Matricula is required for \'Alumno\' role.');
  });

  it('should throw an error if numero de trabajador is missing for jefatura', async () => {
    
    User.findOne.mockResolvedValueOnce(null);
  
   
    await expect(
      signupUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        role: 'Jefatura',
        matricula: null,  
        numeroTrabajador: null, 
      })
    ).rejects.toThrow("Numero de trabajador is required for 'Profesor' or 'Jefatura', 'Control Escolar' roles.");
  });
  

  it('should create a new user successfully', async () => {
    User.findOne.mockResolvedValueOnce(null); 
    User.create.mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com',
      name: 'John Doe',
      role: 'Alumno',
    });

    const result = await signupUser({
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      role: 'Alumno',
      matricula: '12345',
      numeroTrabajador: null,
    });

    expect(result).toHaveProperty('id');
    expect(result.email).toBe('test@example.com');
    expect(result.role).toBe('Alumno');
  });
});

describe('loginUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not found', async () => {
    User.findOne.mockResolvedValueOnce(null);

    await expect(loginUser({ email: 'nonexistent@example.com', password: 'password123' }))
      .rejects
      .toThrow('User not found.');
  });

  it('should throw an error if password is incorrect', async () => {
    const user = { email: 'test@example.com', password: 'hashedPassword' };
    User.findOne.mockResolvedValueOnce(user);
    bcrypt.compare = jest.fn().mockResolvedValueOnce(false); 

    await expect(
      loginUser({ email: 'test@example.com', password: 'wrongpassword' })
    ).rejects.toThrow('Incorrect password.');
  });

  it('should return a token if login is successful', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashed_password',
    };
  
    User.findOne.mockResolvedValueOnce(mockUser);
  
    const mockComparePassword = jest.fn().mockResolvedValue(true);
    bcrypt.compare.mockImplementation(mockComparePassword);
  
    const mockToken = 'fake.jwt.token';
    jwt.sign.mockReturnValue(mockToken);
  
    const result = await loginUser({ email: 'test@example.com', password: 'password123' });
  
    expect(result).toMatch(/^\S+\.\S+\.\S+$/);
  
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, email: mockUser.email },
      process.env.TOKEN_SECRET,
      { expiresIn: '6h' }
    );
  });
  
});

describe('JWT Token Generation and Verification', () => {
  it('should generate a JWT token', () => {
    const user = { id: 1, email: 'test@example.com', name: 'John Doe', role: 'Alumno' };
  
   
    jwt.sign.mockReturnValueOnce('mock.jwt.token');
  
    const token = generateAuthToken(user);
  
   
    expect(token).toBe('mock.jwt.token');  
    expect(token).toMatch(/^\S+\.\S+\.\S+$/); 
  });
  

  it('should throw an error for an invalid JWT token', () => {
    const token = 'invalid.token';
    jwt.verify.mockImplementationOnce(() => { throw new Error('Invalid token'); });

    expect(() => verifyToken(token)).toThrow('Invalid or expired token.');
  });
});
