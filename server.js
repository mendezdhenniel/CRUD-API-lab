
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
app.use(express.json());

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student CRUD API',
      version: '1.0.0',
    },
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

let students = [];
let idCounter = 1;


// CREATE
/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - email
 *               - course
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *               course:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created
 */
app.post('/students', (req, res) => {
  const { name, age, email, course } = req.body;
  const student = { id: idCounter++, name, age, email, course };
  students.push(student);
  res.status(201).json(student);
});

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     responses:
 *       200:
 *         description: List of students
 */



// READ ALL
app.get('/students', (req, res) => {
  res.json(students);
});

// READ ONE
/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */
app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id == req.params.id);
  student ? res.json(student) : res.status(404).send('Not Found');
});

// UPDATE
/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               email:
 *                 type: string
 *               course:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated
 *       404:
 *         description: Student not found
 */
app.put('/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id == req.params.id);
  if (index !== -1) {
    const { name, age, email, course } = req.body;
    students[index] = { id: parseInt(req.params.id), name, age, email, course };
    res.json(students[index]);
  } else {
    res.status(404).send('Not Found');
  }
});

// DELETE
/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Student deleted
 */
app.delete('/students/:id', (req, res) => {
  students = students.filter(s => s.id != req.params.id);
  res.sendStatus(204);
});

app.listen(3000, () => console.log('API running on http://localhost:3000'));
