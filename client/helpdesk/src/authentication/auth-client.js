import { FrontendApi, Configuration } from "@ory/client"
const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const ory = new FrontendApi(
    new Configuration({
        basePath: AUTH_URL,
        baseOptions: {
            withCredentials: true,
        },
    }),
)

export default ory;