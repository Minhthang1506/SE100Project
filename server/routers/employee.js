
const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employee');
const {AuthMiddleware} = require('../helper/JWT');

router.get('/', AuthMiddleware, employeeController.getEmployee);
router.post('/', AuthMiddleware, employeeController.createEmployee);
router.put('/', AuthMiddleware, employeeController.updateEmployee);
router.delete('/', AuthMiddleware, employeeController.deleteEmployee);
router.get('/delete', AuthMiddleware, employeeController.getEmployeeDelete);
router.patch('/delete', AuthMiddleware, employeeController.restoreEmployee);
router.delete('/delete', AuthMiddleware, employeeController.deleteEmployeeforever);
// Thắng
router.get('/shift-assign',AuthMiddleware, employeeController.getShiftAssign);
router.post('/shift-assign',AuthMiddleware, employeeController.createShiftAssign);
router.put('/shift-assign',AuthMiddleware, employeeController.updateShiftAssign);
router.delete('/shift-assign',AuthMiddleware, employeeController.deleteShiftAssign);
// offDay
router.get('/off-day',AuthMiddleware, employeeController.getShiftAssign);
router.post('/off-day',AuthMiddleware, employeeController.createShiftAssign);
router.put('/off-day',AuthMiddleware, employeeController.updateShiftAssign);
router.delete('/off-day',AuthMiddleware, employeeController.deleteShiftAssign);
////////////////////////////////

module.exports = router;