const EmployeeEmail = require("../../models/EmployeeEmail");

const removeDuplicates = (arr) => [...new Set(arr)];

const addEmployees = async (req, res) => {
  const { worker, supervisor, authority } = req.body;

  try {
    let existingInstance = await EmployeeEmail.findOne();

    if (!existingInstance) {
      existingInstance = new EmployeeEmail({ worker, supervisor, authority });
    } else {
      existingInstance.worker = removeDuplicates([
        ...existingInstance.worker,
        ...worker,
      ]);
      existingInstance.supervisor = removeDuplicates([
        ...existingInstance.supervisor,
        ...supervisor,
      ]);
      existingInstance.authority = removeDuplicates([
        ...existingInstance.authority,
        ...authority,
      ]);
    }

    await existingInstance.save();

    res.status(200).json({ message: "Employee emails added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await EmployeeEmail.findOne();

    if (!employees) {
      return res.status(400).json({ message: "No employees found!" });
    }

    res.status(200).json({
      message: "Employees found!",
      employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addEmployees, getEmployees };
