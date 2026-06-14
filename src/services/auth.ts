import api from "../api/api";
import type { RegisterPayload } from "../types/auth";

export const registerUser = async (data: RegisterPayload) => {
    try {
        const res = await api.post("/auth/register", data);
        return res.data;        
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }

};
function RenewToken(refreshToken: string) {
    return api.post("/auth/refresh", { refreshToken })
        .then((res) => {
            if (res.status === 200 && res.data.status === 'success') {
                const newAccessToken = res.data.data.accessToken;
                localStorage.setItem("access_token", newAccessToken);
                return newAccessToken;
            } else {
                throw new Error("Failed to refresh token");
            }
        }
        )
        .catch((error) => {
            console.error("Token refresh error:", error);
            throw error;
        }
        );
}

export const apiAuthenticationServiceGet = async (url: string) => {
    try {
        const Getfetch = await api.get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (Getfetch.status !== 200) throw new Error("an error occurred: Authentication failed");
        const getResponse = Getfetch.data;
        if (getResponse.status === 'success') {
            return Getfetch.data;
        }
    } catch (error) {
        if (error.response?.data?.status === 'error' && error.response?.data?.data === 'Invalid or expired token') {
            const refresh_token = localStorage.getItem("refresh_token");
            if (refresh_token) {
                const access = await RenewToken(refresh_token);
                if (access) {
                    return apiAuthenticationServiceGet(url); // Retry with new token
                }
            }
        }
        throw error;
    }
};

export const apiAuthenticationServicePut = async (url: string, data?: unknown) => {
    try {
        const Putfetch = await api.put(url, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (Putfetch.status !== 200) throw new Error("an error occurred: Authentication failed");
        const putResponse = Putfetch.data;
        if (putResponse.status === 'success') {
            return Putfetch.data;
        }
    } catch (error) {
        if (error.response?.data?.status === 'error' && error.response?.data?.data === 'Invalid or expired token') {
            const refresh_token = localStorage.getItem("refresh_token");
            if (refresh_token) {
                const access = await RenewToken(refresh_token);
                if (access) {
                    return apiAuthenticationServicePut(url, data); // Retry with new token
                }
            }
        }
        throw error;
    }
};

export const apiAuthenticationServiceDelete = async (url: string) => {
    try {
        const Deletefetch = await api.delete(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (Deletefetch.status !== 200) throw new Error("an error occurred: Authentication failed");
        const deleteResponse = Deletefetch.data;
        if (deleteResponse.status === 'success') {
            return Deletefetch.data;
        }
    } catch (error) {
        if (error.response?.data?.status === 'error' && error.response?.data?.data === 'Invalid or expired token') {
            const refresh_token = localStorage.getItem("refresh_token");
            if (refresh_token) {
                const access = await RenewToken(refresh_token);
                if (access) {
                    return apiAuthenticationServiceDelete(url); // Retry with new token
                }
            }
        }
        throw error;
    }
};

export const apiAuthenticationServicePost = async (url: string, method: string, data?: unknown) => {
    try {
        const Postfetch = await api.post(url, 
            data,
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (Postfetch.status != 200) throw new Error("an error occurred: Authentication failed");
        const postResponse = Postfetch.data;
        if (postResponse.status == 'success') {
            return Postfetch.data;
        }

    } catch (error) {
        if(error.status == 'error' && error.data == 'Invalid or expired token'){
            const Refresh_token = localStorage.getItem("refresh_token");
            if(Refresh_token){
                const access = RenewToken(Refresh_token);
                if(access){
                    apiAuthenticationServicePost(url, method, data); // Retry the original request with the new access token
                }
            }
        }
        throw error;

    }
}

// export const apiAuthenticationServiceGet = async (url: string) => {}; 

// export const apiAuthenticationServicePut = async (url: string, data?: unknown) => {};

// export const apiAuthenticationServiceDelete = async (url: string) => {};
