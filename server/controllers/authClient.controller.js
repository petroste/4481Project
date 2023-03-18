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

exports.assignCustomerToAgent = (req, res) => {
    var originalAgent = req.body.originalAgent
    var targetAgent = req.body.targetAgent;
    var customer = req.body.customer;
    var agentList = Array.from(authenticatedUsers.keys());
    if (agentList.includes(originalAgent) && agentList.includes(targetAgent))
    {
        var customerListForOriginalAgent = Array.from(authenticatedUsers.get(originalAgent));
        var customerListForTargetAgent = Array.from(authenticatedUsers.get(targetAgent));
        if (customerListForOriginalAgent.includes(customer))
        {
            // find and delete customer in the original agent array
            var index = customerListForOriginalAgent.indexOf(customer);
            delete customerListForOriginalAgent[index];
            authenticatedUsers.set(originalAgent, customerListForOriginalAgent);

            // find and add customer to the target agent array
            customerListForTargetAgent.push(customer);
            authenticatedUsers.set(targetAgent, customerListForTargetAgent);
            console.log(Array.from(authenticatedUsers.keys()) + "=>>>" + Array.from(authenticatedUsers.values()));
            res.status(200).send({message: "Switch performed successfully"});
        }
        else
        {
            return res.status(404).send({message: "Customer is not in original agent's customer list"});
        }
    }
    else
    {
        return res.status(404).send({message: "Target agent is not online"});
    }
}