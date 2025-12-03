// backend/controller/userController.js
import UsersService from "../service/userService.js";

// Thêm dòng này để kiểm tra ngay lập tức khi chạy server:
//console.log('Loaded .env from:', envPath);

class UsersController {

  // [GET] /api/user
  async getAll(req, res) {
    try {

      const data = await UsersService.getUsers();
        console.log("Fetched users:", data);
      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // [GET] /api/user/:id
  async getById(req, res) {
    try {
      const { id } = req.params;

      const data = await UsersService.getUserById(id);

      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 
                     error.message.includes("Access denied") ? 403 : 500;
      
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  // [POST] /api/user/register
  async create(req, res) {
    try {
      // Gọi Service
      const newUser = await UsersService.createUser({
        ...req.body,
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // [PUT] /api/user/:id
  async update(req, res) {
    try {
      const { id } = req.params;

      const updatedUser = await UsersService.updateUser(id, req.body);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // [DELETE] /api/user/:id
  async delete(req, res) {
    try {
      const { id } = req.params;

      await UsersService.deleteUser(id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

// Export Singleton
export default new UsersController();