import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/authMiddleware';

describe('Auth Middleware', () => {
    it('should return 401 if no token is provided', () => {
        const req = { header: jest.fn().mockReturnValue(null) } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
    });

    it('should return 401 if token is not valid', () => {
        const req = { header: jest.fn().mockReturnValue('invalidtoken') } as unknown as Request;
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        jwt.verify = jest.fn().mockImplementation(() => { throw new Error('Token is not valid'); });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
    });

    it('should call next if token is valid', () => {
        const req = { header: jest.fn().mockReturnValue('validtoken') } as unknown as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;

        jwt.verify = jest.fn().mockReturnValue({ id: '12345' });

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
