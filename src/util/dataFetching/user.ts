import { IUser } from '../../interfaces/UserInterface';

export const fetchAllDataUser = async (users: IUser[]) => {
  let user = [];
  for (let index in users) {
    user.push({
      id: users[index]._id,
      firstName: users[index].firstName,
      surname: users[index].surname,
      fullName: users[index].fullName,
      userName: users[index].userName,
      createdAt: users[index].createdAt,
      email: users[index].email,
      is_active: users[index].active,
      phoneNumber: users[index].phoneNumber,
      permission: users[index].permission,
      department: users[index].department,
      profile: users[index].profile,
      updatedAt: users[index].updatedAt,
    });
  }
  return user;
};

export const responseDataUser = (data: any, page: number) => {
  return {
    users: data,
    currentPage: Number(page),
    hasMorePages: true,
    lastPage: Number(page),
    perPage: data.length,
    prevPageUrl: null,
    total: data.length,
  };
};
