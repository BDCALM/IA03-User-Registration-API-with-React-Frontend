import UserRepository from "../repository/UsersRepository.js";
import {hashPassword} from "../helpers/hashingPassword.js";
import { isValidEmail } from "../helpers/validationHelper.js";

class UsersService {
  
  /**
   */
  async getUsers() {
    return await UserRepository.getAll();
  }

  /**
   * Tạo user mới
   * - Rule 1: Tên không được để trống
   */
  async createUser({  email, password, createdAt = new Date(Date.now()) }) {
    //valid dữ liệu
    if (!email || email.trim() === "") throw new Error("email is required");
    if (!isValidEmail(email.trim())) throw new Error("email is not valid");
    if (!password || password.trim() === "") throw new Error("password is required");
    if (password.trim().length < 6) {
        throw new Error("password must be at least 6 characters long");
    }
     if (isNaN(new Date(createdAt).getTime())) {
        throw new Error("createdAt must be a valid date");
    }

    //kiểm tra tồn tại ?
    const existing = await UserRepository.findByEmail(email.trim());
    if (existing && existing.length > 0) {
      const isExactMatch = existing
            .some(user => user.email.toLowerCase() === email.trim().toLowerCase());
      if (isExactMatch) {
        throw new Error(`User with email '${email}' already exists`);
      }
    }
    const hashedPassword = await hashPassword(password.trim());


    // Chuẩn bị dữ liệu để lưu
    const newUserData = {
      email: email.trim(),
      password: hashedPassword,
      created_at: createdAt
    };

    // Gọi Repository -> Lưu xuống DB
    return await UserRepository.create(newUserData);
  }

  /**
   * Lấy chi tiết một danh mục
   * @param {string} id - ID danh mục
   * @param {string} tenantId - ID nhà hàng (Dùng để verify quyền sở hữu)
   */
  async getUserById(id) {
    if (!id) throw new Error("User ID is required");

    const user = await UserRepository.getById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Cập nhật danh mục
   */
  async updateUser(id, updates) {
    await this.getUserById(id);

    // 2. Nếu cập nhật tên, cần check trùng lặp (Optional - tuỳ độ kỹ tính)
    if (updates.email) {
      if (!isValidEmail(updates.email.trim())) throw new Error("email is not valid");
       const existing = await UserRepository.findByEmail(updates.email.trim());
       const isDuplicate = existing.some(user => user.id !== id && user.email.toLowerCase() === updates.email.trim().toLowerCase());
       if (isDuplicate) {
         throw new Error(`User email '${updates.email}' already exists`);
       }
    }

    // 3. Thực hiện update
    return await UserRepository.update(id, updates);
  }

  /**
   * Xóa danh mục
   * (Lưu ý: Cân nhắc dùng Soft Delete (is_active=false) thay vì xóa hẳn nếu dữ liệu quan trọng)
   */
  async deleteUser(id, tenantId) {
    // Kiểm tra quyền sở hữu trước khi xóa
    await this.getUserById(id, tenantId);
    //TODO: cân nhắc dùng soft delete
    //update is_active = false thay vì xóa hẳn
    //return await UserRepository.update(id, { is_active: false });


    return await UserRepository.delete(id);
  }
}

// Export Singleton
export default new UsersService();