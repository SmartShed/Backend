const checkAuthorization = (req, res, next) => {
    const { position } = req.body;


    if (position === 'authority') {
        next();
    }
    else if (position === 'supervisor') {
        if (position === 'worker') {
            next();
        } else {
            res.status(403).json({ message: 'Supervisor can only add worker.' });
        }
    }
    else {
        res.status(403).json({ message: 'Workers are not authorized to add anyone.' });
    }
};



module.exports = checkAuthorization;
