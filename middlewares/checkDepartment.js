const checkDepartment = (department) => {
    return (req, res, next) => {
      if (req.vendor.role === 'manager') {
        const managerDepartments = req.vendor.department || [];
        if (!managerDepartments.includes(department)) {
          return res.status(403).send({ success: false, message: "Access denied: Department not authorized" });
        }
      }
      next();
    };
  };

  module.exports =  checkDepartment ;
