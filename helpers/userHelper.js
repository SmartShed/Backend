const User = require("../models/User");

const getAllWorkerIds = async () => {
    try {
        const workers = await User.find({ position: "worker" });

        const workerIds = workers.map((worker) => worker._id);

        return workerIds;


    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

const getAllSupervisorIds = async () => {
    try {
        const supervisors = await User.find({ position: "supervisor" });

        const supervisorIds = supervisors.map((supervisor) => supervisor._id);

        return supervisorIds;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

const getAllAuthorityIds = async () => {
    try {
        const authorities = await User.find({ position: "authority" });

        const authorityIds = authorities.map((authority) => authority._id);

        return authorityIds;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

module.exports = { getAllWorkerIds, getAllSupervisorIds, getAllAuthorityIds };