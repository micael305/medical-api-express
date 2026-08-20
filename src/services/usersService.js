import prisma from '../config/prisma.js';

const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true }
    });
};

const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true }
    });
    if (!user) {
        throw new Error ('User not found');
    }
    return user;
};

const updatedUser = async (id, data) => {
    return await prisma.user.update({
        where: {id},
        data: {name: data.name, email: data.email}
    });
};

const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: {id}
    });
};

export { getAllUsers, getUserById, updatedUser, deleteUser }; 