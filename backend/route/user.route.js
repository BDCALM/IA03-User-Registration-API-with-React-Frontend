// backend/route/user.route.js
import express from 'express';
import UsersController from '../controller/userController.js';

const router = express.Router();

/**
 * Định nghĩa các Routes cho Users
 */
    
// Lấy danh sách (GET /api/user)
router.get('/', (req, res) => UsersController.getAll(req, res));

// Lấy chi tiết (GET /api/user/:id)
router.get('/:id', (req, res) => UsersController.getById(req, res));

// Tạo mới (POST /api/user/register)
router.post('/register', (req, res) => UsersController.create(req, res));

// Cập nhật (PUT /api/user/:id)
router.put('/:id', (req, res) => UsersController.update(req, res));

// Xóa (DELETE /api/user/:id)
router.delete('/:id', (req, res) => UsersController.delete(req, res));

export default router;