const {authenticatedUsers} = require ('../sockets');

exports.getAgentToConnect = (req, res) => {
    var authUsersArray = Array.from(authenticatedUsers.keys());
    var authUsersCustomers = Array.from(authenticatedUsers.values());
    if (authUsersArray.length == 0)
    {
        return res.status(404).send({message: "There are no active agents currently, please try again later."})
    }
    else
    {
        // Get the agent with the least amount of connections
        var indexAgentToAssign = authUsersCustomers.indexOf(Math.min(...authUsersCustomers));
        var agentToAssign = authUsersArray[indexAgentToAssign];
        authenticatedUsers.set(agentToAssign, authUsersCustomers[indexAgentToAssign] + 1 );
        return res.status(200).send({agent: agentToAssign});
    }
}