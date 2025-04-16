import { User } from "../app.model";

const user: User[] = [
    {
        id: 1,
        employeeId: 1,
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '1',
        role: 'ADMIN'
    },
    {
        id: 2,
        employeeId: 2,
        name: 'admin',
        email: 'admin@example.com',
        password: '1',
        role: 'EMPLOYEE'
    },
    {
        id: 3,
        employeeId: 3,
        name: 'Jane Smith',
        email: 'jane.smith@gmail.com',
        password: '1',
        role: 'EMPLOYEE'
    },
];

export default user;