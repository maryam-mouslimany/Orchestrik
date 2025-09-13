import apiCall from "../../services/apiCallService";

export type OptionItem = {id:number, name:string};
export type LoaderData = {
    skills: OptionItem[];
    positions: OptionItem[];
    roles: OptionItem[];
};

export async function usersCreateLoader(): Promise<LoaderData> {
    const [skills, positions, roles] = await Promise.all([
        apiCall("/skills", { method: "GET", requiresAuth: true }),
        apiCall("/positions", { method: "GET", requiresAuth: true }),
        apiCall("/roles", { method: "GET", requiresAuth: true }),
    ]);
    return {
        skills: skills.data,
        positions: positions.data,
        roles: roles.data,
    };
}
