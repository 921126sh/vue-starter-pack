import http from './http-client';
const END_POINT = '/users';

/**
 * 사용자 목록을 조회한다.
 * @param { Object =>
    userId?: string
    userNm?: string
 * } param 조회조건
 */
const getAllUsers = (param) => http.get(END_POINT, { params: param }).then(res => res.data.data ? res.data.data.users : []);

/**
 * 사용자를 조회한다.
 * @param { String } userId 사용자 식별자
 */
const getUser = (userId) => http.get(END_POINT, { userId });

/**
 * 사용자를 등록한다.
 * @param { Object } user 사용자
 */
const createUser = (user) => http.post(END_POINT, user);

/**
 * 사용자를 삭제한다.
 * @param { String } userId 사용자 식별자
 */
const deleteUser = (userId) => http.delete(`${END_POINT}/${userId}`);

/**
 * 사용자를 수정한다.
 * @param { String } userId 사용자 식별자
 * @param { Object } user 사용자
 */
const updateUser = (userId, user) => http.put(`${END_POINT}/${userId}`, user).then(res => res);

export {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser,
}
