import { ObjectId } from 'mongodb';
import { getAllUsers, addUser, deleteUser, getUser } from './adminFunctions.js'; 
import { insertContact, getAllContacts, deleteContact,updateContact } from './studentFunctions.js'; 
import { get } from 'mongoose';

import app from './main.js';
app.get('/contacts', async (req, res) => {
    const userId = req.query.userId;
    try {
      if (!userId) {
        res.status(400).send("Missing user ID");
        return;
      }
      const contacts = await getAllContacts(userId);
      res.json(contacts);
    } catch (err) {
      res.status(500).send('Failed to retrieve contacts');
    }
  });
  
  app.post('/contacts', async (req, res) => {
    const { userId, full_name, gender, email, phone } = req.body;
    if (!userId || !full_name || !gender || !email || !phone) {
      res.status(400).send('Missing required fields');
      return;
    }
    try {
      await insertContact(userId, full_name, gender, email, phone);
      res.status(201).send('Contact added');
    } catch (err) {
      res.status(500).send(`Error adding contact: ${err.message}`);
    }
  });
  
  app.put('/contacts/:email', async (req, res) => {
    const { full_name, gender, phone } = req.body;
    const { email } = req.body;
    if (!full_name || !gender || !phone) {
      res.status(400).send('Missing required fields');
      return;
    }
    try {
      const contact = await updateContact(email, full_name, gender, phone);
      if (!contact) {
        res.status(404).send('Contact not found');
        return;
      }
      res.status(200).send(contact);
    } catch (err) {
      res.status(500).send(`Error updating contact: ${err.message}`);
    }
  });
  
  
  app.delete('/contacts/:email', async (req, res) => {
    const { email } = req.params;
    const { userId } = req.body; 
    if (!userId) {
      res.status(400).send("Missing user ID");
      return;
    }
    try {
      const result = await deleteContact(email, userId);
      if (result.deletedCount === 0) {
        res.status(404).send('No contact found with that email or you are not authorized to delete it.');
      } else {
        res.status(200).send({ message: 'Contact deleted' });
      }
    } catch (err) {
      res.status(500).send(`Error deleting contact: ${err.message}`);
    }
  });
  
  
  
  
  
  //users
  app.get('/users', async (req, res) => {
      try {
        const users = await getAllUsers();
        res.json(users);
      } catch (err) {
        res.status(500).send('Failed to retrieve users');
      }
    });
    
  
    app.post('/users', async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).send('Missing email or password');
        return;
      }
      try {
        const newUser = await addUser(email, password);
        res.status(201).json(newUser);
      } catch (err) {
        res.status(500).send(`Error creating user: ${err.message}`);
      }
    });
    
  
    app.post('/checkuser', async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).send('Missing email or password');
        return;
      }
      try {
         
        const checkuser = await getUser(email, password);
        res.status(200).json(checkuser);
      } catch (err) {
        res.status(500).send(`Error creating user: ${err.message}`);
      }
    });
   
    
    app.delete('/users/:email', async (req, res) => {
      const { email } = req.params;
      try {
        const result = await deleteUser(email);
        if (result.deletedCount === 0) {
          res.status(404).json('No user found with that email.');
        } else {
          res.status(200).json({ message: 'User deleted', ...result });
        }
      } catch (err) {
        res.status(500).json(`Error deleting user: ${err.message}`);
      }
    });