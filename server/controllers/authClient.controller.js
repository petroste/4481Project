const {authenticatedUsers} = require ('../sockets');

exports.getAgentToConnect = (req, res) => {
    var authUsersArray = Array.from(authenticatedUsers.keys());
    var authUsersCustomers = Array.from(authenticatedUsers.values());
    var customer = req.body.userName;
    if (authUsersArray.length == 0)
    {
        return res.status(404).send({message: "There are no active agents currently, please try again later."})
    }
    else
    {
        // Get the agent with the least amount of connections
        var min = authUsersCustomers[0].length;
        var indexAgentToAssign = 0;
        for (let i = 1; i < authUsersCustomers.length; i++)
        {
            if (authUsersCustomers[i].length < min)
            {
                min = authUsersCustomers[i].length;
                indexAgentToAssign = i;
            }
        }

        var agentToAssign = authUsersArray[indexAgentToAssign];
        var updatedCustomerList = [...authUsersCustomers[indexAgentToAssign], customer];
        authenticatedUsers.set(agentToAssign, updatedCustomerList);
        return res.status(200).send({agent: agentToAssign});
    }
}

exports.getCustomerList = (req, res) => {
    var agent = req.body.agent;
    var customers = authenticatedUsers.get(agent);

    res.status(200).send({customers: customers});
}