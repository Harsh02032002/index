import Menu from "./menu.model";
import { AppError } from "../../shared/middlewares/error.middleware";

// Public menu
export const getPublicMenu = async () => {
  return Menu.find({ isActive: true }).sort({ createdAt: -1 });
};

// Admin menu (all)
export const getAllMenu = async () => {
  return Menu.find().sort({ createdAt: -1 });
};

// Seller menu
export const getSellerMenu = async (sellerId: string) => {
  return Menu.find({ sellerId }).sort({ createdAt: -1 });
};

export const createMenuItem = async (
  sellerId: string,
  data: any
) => {
  return Menu.create({
    ...data,
    sellerId,
  });
};

export const updateMenuItem = async (
  sellerId: string,
  menuId: string,
  data: any
) => {
  const menu = await Menu.findOne({
    _id: menuId,
    sellerId,
  });

  if (!menu) {
    throw new AppError("Menu item not found", 404);
  }

  Object.assign(menu, data);
  await menu.save();

  return menu;
};

export const deleteMenuItem = async (menuId: string) => {
  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new AppError("Menu item not found", 404);
  }

  await menu.deleteOne();
};