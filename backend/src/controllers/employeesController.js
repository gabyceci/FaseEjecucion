//array de metodos (C R U D)
const employeesController = {};
import { json } from "express";
import employeesModel from "../models/Employees.js"; 

// SELECT
employeesController.getEmployees = async (req, res) => {
  const employees = await employeesModel.find();
  res.json(employees);
};

// INSERT
employeesController.createEmployees = async (req, res) => {
  const {
    name,
    email,
    password,
    telephone,
    address,
    role,
    hireDate,
    salary,
    dui,
  } = req.body;
  const newEmployees = new employeesModel({
    name,
    email,
    password,
    telephone,
    address,
    role,
    hireDate,
    salary,
    dui,
  });
  await newEmployees.save();
  res.json({ message: "Employees saved" });
};

// DELETE
employeesController.deleteEmployees = async (req, res) => {
  await employeesModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Employees deleted" });
};

// UPDATE
employeesController.updatedEmployees = async (req, res) => {
  const {
    name,
    email,
    password,
    telephone,
    address,
    role,
    hireDate,
    salary,
    dui,
  } = req.body;

  await employeesModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      email,
      password,
      telephone,
      address,
      role,
      hireDate,
      salary,
      dui,
    },
    { new: true }
  );

  res, json({ message: "Employees updated" });
};

export default employeesController;