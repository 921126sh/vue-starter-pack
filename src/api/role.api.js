import http from './http-client';
const END_POINT = '/roles';

/**
 * 역할목록을 조회한다.
 */
const getAllRoles = () => http.get(`${END_POINT}`).then(res => res.data.data ? res.data.data.roles : []);

export {
    getAllRoles,
}
