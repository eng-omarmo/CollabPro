// const { loginUser } = require('../controllers/userController');
// const User = require('../models/userModel');
// const bcrypt = require('bcrypt');
// const { generateToken } = require('../controllers/userController');

// jest.mock('../models/userModel');
// jest.mock('bcrypt');

// describe('loginUser', () => {
//   let req, res;

//   beforeEach(() => {
//     req = {
//       body: {
//         email: 'test@example.com',
//         password: 'password123'
//       }
//     };

//     res = {
//       json: jest.fn(),
//       status: jest.fn(function() { return this; })
//     };

//     User.findOne.mockClear();
//     bcrypt.compare.mockClear();
//     res.json.mockClear();
//     res.status.mockClear();
//   });

//   it('should return a token on successful login', async () => {
//     const user = {
//       email: 'test@example.com',
//       password: 'hashedpassword',
//       isEmailVerified: true
//     };

//     User.findOne.mockResolvedValue(user);
//     bcrypt.compare.mockResolvedValue(true);

//     const generateTokenMock = jest.spyOn(require('../controllers/userController'), 'generateToken').mockReturnValue('token123');

//     await loginUser(req, res);

//     expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
//     expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
//     expect(generateTokenMock).toHaveBeenCalledWith(user);
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ token: 'token123' });

//     generateTokenMock.mockRestore(); // Restore the original implementation after the test
//   });

//   it('should return 404 if user not found', async () => {
//     User.findOne.mockResolvedValue(null);

//     await loginUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(404);
//     expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
//   });

//   it('should return 401 if email is not verified', async () => {
//     const user = {
//       email: 'test@example.com',
//       password: 'hashedpassword',
//       isEmailVerified: false
//     };

//     User.findOne.mockResolvedValue(user);

//     await loginUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(res.json).toHaveBeenCalledWith({ message: "Please verify your email first" });
//   });

//   it('should return 401 if password is incorrect', async () => {
//     const user = {
//       email: 'test@example.com',
//       password: 'hashedpassword',
//       isEmailVerified: true
//     };

//     User.findOne.mockResolvedValue(user);
//     bcrypt.compare.mockResolvedValue(false);

//     await loginUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(401);
//     expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
//   });

//   it('should return 500 if there is an internal server error', async () => {
//     User.findOne.mockRejectedValue(new Error('Server error'));

//     await loginUser(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
//   });
// });
// __tests__/simple.test.js

test('1 + 1 equals 2', () => {
    expect(1 + 1).toBe(2);
  });
  