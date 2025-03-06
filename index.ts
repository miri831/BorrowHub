import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello node!');
});

interface Equipment {
    id: number;
    status: 'available' | 'borrowed';
    category: string;
    name: string;
    imgUri?: string;
    description?: string;
}

interface User {
    id: number;
    username: string;
    password: string;
    phone?: string;
    email?: string;
    isAdmin?: boolean;
}

interface Borrow {
    id: number;
    userId: number;
    equipmentId: number;
    startDate: Date;
    endDate: Date;
    status: 'borrowed' | 'available' | 'completed' | 'rejected';
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: User;
    }
}

const isAdmin = (req: Request, res: Response, next: Function) => {
    const user = req.header('user');
    if (user === 'admin') {
        req.user = users.find(u => u.isAdmin === true && u.username === 'admin');
        next();
    } else {
        res.status(403).send('Forbidden');
        return;
    }
};

const isLoggedIn = (req: Request, res: Response, next: Function) => {
    const user = req.header('user') || '0';
    const userExists = users.find(u => u.id === parseInt(user));
    if (userExists) {
        req.user = userExists
        next();
    } else {
        res.status(401).send('Unauthorized');
        return
    }   
};


let equipments: Equipment[] = []
let users: User[] = [
    { id: 1, username: 'admin', password: '1234567', isAdmin: true}]

let borrows: Borrow[] = []

app.post('/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.status(200).send({ message: 'Login successful', userId: user.id });
    } else {
        res.status(401).send({ message: 'Invalid email or password' });
    }
});
app.post('/auth/register', (req: Request, res: Response) => {
    const { username, password, phone, email } = req.body;
    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
        res.status(409).send({ message: 'Username already exists' });
        return;
    }

    const newUser: User = {
        id: Math.floor(Math.random() * 1000) + 1,
        username,
        password,
        phone,
        email
    };

    users.push(newUser);
    res.status(201).send({ message: 'User registered successfully', userId: newUser.id });
});

app.get('/equipments', (req: Request, res: Response) => {
  res.send(equipments);
});

app.get('/equipment/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const equipment = equipments.find(equipment => equipment.id === id);
    if (equipment) {
        res.status(200).send(equipment);
    } else {
        res.status(404).send('Equipment not found');
    }
});

app.post('/admin/equipments', isAdmin, (req: Request, res: Response) => {
  const newEquipment: any = req.body;
  const generateId = Math.floor(Math.random() * 1000) + 1;
  newEquipment.id = generateId;
  equipments.push(newEquipment);
  res.status(201).send(newEquipment);
});

app.post('/admin/equipments', isAdmin, (req: Request, res: Response) => {
    const newEquipment: any = req.body;
    const generateId = Math.floor(Math.random() * 1000) + 1;
    newEquipment.id = generateId;
    equipments.push(newEquipment);
    res.status(201).send(newEquipment);
});

app.put('/admin/equipments/:id', isAdmin, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updatedEquipment = req.body;
    const equipment = equipments.find(equipment => equipment.id === id);
    if (equipment) { 
        equipment.status = updatedEquipment.status;
        equipment.category = updatedEquipment.category;
        equipment.name = updatedEquipment.name;
        res.status(200).send(equipment);
    } else {
        res.status(404).send('Equipment not found');
    }
});

app.delete('/admin/equipments/:id', isAdmin, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const equipmentIndex = equipments.findIndex(equipment => equipment.id === id);

    if (equipmentIndex !== -1) {
        equipments.splice(equipmentIndex, 1);
        res.status(200).send({ message: 'Equipment deleted successfully' });
    } else {
        res.status(404).send('Equipment not found');
    }
});

app.post('/borrow', isLoggedIn, (req: Request, res: Response): void => {
      
    const { equipmentId, startDate, endDate } = req.body;
    const userId = req.user?.id;
    const equipment = equipments.find(e => e.id === equipmentId);

    if (!equipment) {
        res.status(404).send('Equipment not found');
        return
    }
    if (equipment.status === 'borrowed') {
        res.status(400).send('Equipment is already borrowed');
        return;
    }

    const newBorrow: Borrow = {
        id: Math.floor(Math.random() * 1000) + 1,
        userId: userId || 0,
        equipmentId,
        startDate,
        endDate,
        status: 'borrowed'
    };
    
    borrows.push(newBorrow);

    equipment.status = 'borrowed';

    res.status(201).send(newBorrow);
});
app.put('/borrow/:borrowId/return', isLoggedIn, (req: Request, res: Response) => {
    const borrowId = parseInt(req.params.borrowId);
    const index = borrows.findIndex(b => b.id === borrowId);

    if (index === -1) {
        res.status(404).send('Borrow record not found');
        return;
    }

    const userId = req.user?.id;
    if (borrows[index].userId !== userId) {
        res.status(403).send('You are not allowed to return this equipment');
        return;
    }

    borrows[index].status = 'completed';
    const equipment = equipments.find(e => e.id === borrows[index].equipmentId);
    if (equipment) {
        equipment.status = 'available';
    }

    res.status(200).send({ message: 'Equipment returned successfully' });
});

app.put('/admin/borrow/:borrowId/return', isAdmin, (req: Request, res: Response) => {
    const borrowId = parseInt(req.params.borrowId);
    const index = borrows.findIndex(b => b.id === borrowId);

    if (index === -1) {
        res.status(404).send('Borrow record not found');
        return;
    }

    borrows[index].status = 'completed';
    const equipment = equipments.find(e => e.id === borrows[index].equipmentId);
    if (equipment) {
        equipment.status = 'available';
    }
    res.status(200).send({ message: 'Equipment returned successfully' });
});

app.get('/borrows/me', isLoggedIn, (req: Request, res: Response) => {
    const userId = req.user?.id;
    const userBorrows = borrows.filter(borrow => borrow.userId === userId);

    res.status(200).send(userBorrows);
    
});

app.get('/admin/borrows', isAdmin, (req: Request, res: Response) => {
    res.status(200).send(borrows.find(borrow => borrow.status === 'borrowed'));
});

app.get('/admin/borrows/overdue', isAdmin, (req: Request, res: Response) => {
    const currentDate = new Date();
    const overdueBorrows = borrows.filter(borrow => borrow.endDate < currentDate && borrow.status === 'borrowed');
    res.status(200).send(overdueBorrows);
});

app.put('/admin/borrow/:id', isAdmin, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updatedBorrow = req.body;
    const borrow = borrows.find(borrow => borrow.id === id);

    if (borrow) {
        borrow.endDate = updatedBorrow.endDate;
        borrow.status = updatedBorrow.status;
        if (updatedBorrow.status === 'completed' || updatedBorrow.status === 'rejected') {
            const equipment = equipments.find(e => e.id === borrow.equipmentId);
            if (equipment) {
                equipment.status = 'available';
            }
        }
        res.status(200).send(borrow);
    } else {
        res.status(404).send('Borrow record not found');
    }
});

app.get('/categories', (req: Request, res: Response) => {
    let categories = equipments.map(e => e.category);
    categories = [...new Set(categories)];
    res.send(categories);
});

app.get('/admin/users', isAdmin, (req: Request, res: Response) => {
    res.send(users);
}); 


