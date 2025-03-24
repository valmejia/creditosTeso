const { signupUser, verifyToken, generateAuthToken, loginUser } = require('../services/auth.services'); 
const { User } = require('../db/index'); 
const authService = require('../services/auth.services');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../db/index');  
jest.mock('bcrypt');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('signupUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should throw an error if user already exists', async () => {
    User.findOne.mockResolvedValueOnce({ email: 'test@example.com' });

    await expect(
      signupUser({
        id: 1,
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
        role: 'InvalidRole', // Invalid role
        matricula: '12345',
        numeroTrabajador: null,
      })
    ).rejects.toThrow("Invalid role. Valid roles are: Alumno, Jefatura, Control Escolar, Profesor.");
  });

  it('should throw an error if email format is invalid', async () => {
    const userData = {
      email: "invalidemail", // Invalid email format
      password: "password123",
      name: "Test User",
      role: "Alumno",
      matricula: "12345",
      numeroTrabajador: null,
    };
  
    await expect(signupUser(userData)).rejects.toThrow("Validation error: Invalid email format.");
  });
  

  it('should throw an error if matricula is missing for Alumno', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'John Doe',
      role: 'Alumno',
      matricula: null, // Missing matricula
      numeroTrabajador: null,
    };
  
    await expect(signupUser(userData)).rejects.toThrow('Matricula is required for \'Alumno\' role.');
  });

  it('should throw an error if numero de trabajador is missing for Jefatura', async () => {
    User.findOne.mockResolvedValueOnce(null);
  
    await expect(
      signupUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
        role: 'Jefatura',
        matricula: null,
        numeroTrabajador: null, // Missing numeroTrabajador
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

  it('should throw an error if matricula and numeroTrabajador are provided together for Alumno', async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      role: "Alumno",
      matricula: "12345",
      numeroTrabajador: "67890" // Both matricula and numeroTrabajador are provided
    };

    await expect(signupUser(userData)).rejects.toThrow("Matricula and numero de trabajador cannot be provided together for 'Alumno' role.");
  });

  it('should throw an error if matricula and numeroTrabajador are provided together for Profesor', async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      role: "Profesor",
      matricula: "12345",
      numeroTrabajador: "67890" // Both matricula and numeroTrabajador are provided
    };

    await expect(signupUser(userData)).rejects.toThrow("Numero de trabajador and matricula cannot be provided together for 'Profesor', 'Jefatura' or 'Control Escolar' roles.");
  });

  it('should throw an error if matricula and numeroTrabajador are provided together for Jefatura', async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      role: "Jefatura",
      matricula: "12345",
      numeroTrabajador: "67890" // Both matricula and numeroTrabajador are provided
    };

    await expect(signupUser(userData)).rejects.toThrow("Numero de trabajador and matricula cannot be provided together for 'Profesor', 'Jefatura' or 'Control Escolar' roles.");
  });

  it('should throw an error if matricula and numeroTrabajador are provided together for Control Escolar', async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      role: "Control Escolar",
      matricula: "12345",
      numeroTrabajador: "67890" // Both matricula and numeroTrabajador are provided
    };

    await expect(signupUser(userData)).rejects.toThrow("Numero de trabajador and matricula cannot be provided together for 'Profesor', 'Jefatura' or 'Control Escolar' roles.");
  });
  
  it('should create a new user if valid data is provided', async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      role: "Profesor",
      matricula: null,
      numeroTrabajador: "67890"
    };

    User.findOne.mockResolvedValueOnce(null); // Ensure the user does not exist
    User.create.mockResolvedValueOnce({
      id: 1,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      matricula: userData.matricula,
      numeroTrabajador: userData.numeroTrabajador,
    });

    const result = await signupUser(userData);

    expect(result).toHaveProperty('id');
    expect(result.email).toBe(userData.email);
    expect(result.name).toBe(userData.name);
    expect(result.role).toBe(userData.role);
    expect(result.matricula).toBe(userData.matricula);
    expect(result.numeroTrabajador).toBe(userData.numeroTrabajador);
  });

  it('should throw an error if email format is invalid', async () => {
    const userData = {
      email: "invalidemail", // Invalid email format
      password: "password123",
      name: "Test User",
      role: "Alumno",
      matricula: "12345",
      numeroTrabajador: null,
    };

    await expect(signupUser(userData)).rejects.toThrow("Validation error: Invalid email format.");
  });
});

describe('loginUser', () => {
  it('should return a JWT token for valid credentials', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const mockUser = { 
      id: 1, 
      email: 'test@example.com', 
      password: 'hashed_password', 
      name: 'John Doe',
      role: 'user'
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);  
    jwt.sign.mockReturnValue('mocked_jwt_token');  

    const token = await authService.loginUser(userData); 

    expect(token).toBe('mocked_jwt_token');
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(userData.password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, email: 'test@example.com', name: 'John Doe', role: 'user' },
      process.env.TOKEN_SECRET,
      { expiresIn: '6h' }
    );
  });
});


describe('authService', () => {
  
  describe('generateAuthToken', () => {
    it('should generate a valid JWT token with the correct payload', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
        role: 'user'
      };

      jwt.sign.mockReturnValue('mocked_jwt_token'); 

      const token = authService.generateAuthToken(user);

      expect(token).toBe('mocked_jwt_token');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, email: 'test@example.com', name: 'John Doe', role: 'user' },
        process.env.TOKEN_SECRET,
        { expiresIn: '6h' }
      );
    });
  });

  describe('verifyToken', () => {
    it('should decode the JWT token correctly', () => {
      const token = 'mocked_jwt_token';
      const decodedPayload = { id: 1, email: 'test@example.com' };

      jwt.verify.mockReturnValue(decodedPayload);  

      const result = authService.verifyToken(token);

      expect(result).toEqual(decodedPayload);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.TOKEN_SECRET);
    });

    it('should throw an error for an invalid token', async () => {
      const token = 'invalid_token';
      
      jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });
    
      try {
        await authService.verifyToken(token);  
      } catch (err) {
        expect(err.message).toBe('Invalid or expired token.');
      }
    });
    
  });

  describe('checkRole', () => {
    it('should allow access if roles match', () => {
      const result = authService.checkRole('admin', 'admin');
      expect(result).toBe(true);
    });

    it('should throw an error if roles do not match', () => {
      try {
        authService.checkRole('user', 'admin');
      } catch (err) {
        expect(err.message).toBe("You don't have permission to access this resource. Required role: admin");
      }
    });
  });
});
