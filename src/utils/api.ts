import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const baseURL = 'http://localhost:3000';

async function makeRequest<T = unknown, D = unknown>(
    axiosConfig: AxiosRequestConfig<D>,
    controller?: AbortController
) {
    const config: AxiosRequestConfig<D> =
        controller instanceof AbortController
            ? { ...axiosConfig, signal: controller.signal }
            : axiosConfig;
    try {
        const res = await axios<T>(config);
        return res;
    } catch (err: AxiosError | any) {
        if (!axios.isCancel(err)) console.error(err.message || err);
        return null;
    }
}

const api = {
    get<T>(path: string, controller?: AbortController) {
        return makeRequest<T>(
            {
                method: 'get',
                baseURL,
                url: path,
            },
            controller
        );
    },
    post<T, D>(path: string, data: D, controller?: AbortController) {
        return makeRequest<T, D>(
            { method: 'post', baseURL, url: path, data },
            controller
        );
    },
    put<T, D>(path: string, data: D, controller?: AbortController) {
        return makeRequest<T, D>(
            { method: 'put', baseURL, url: path, data },
            controller
        );
    },
    patch<T, D>(path: string, data: D, controller?: AbortController) {
        return makeRequest<T, D>(
            { method: 'patch', baseURL, url: path, data },
            controller
        );
    },
    delete<T>(path: string, controller?: AbortController) {
        return makeRequest<T>(
            { method: 'delete', baseURL, url: path },
            controller
        );
    },
};

export default api;
