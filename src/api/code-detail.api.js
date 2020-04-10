import http from './http-client';
const END_POINT = '/code-groups';

/**
 * 코드상세 목록을 조회한다.
 * @param { String } cdId 코드 식별자
 */
const getAllDetailCode = (cdId) => http.get(`${END_POINT}/${cdId}/code-details`).then(res => res.data.data ? res.data.data.cdDtls : []);

/**
 * 코드상세를 등록한다.
 * @param { String } cdId 코드 식별자
 * @param { Object } dtl 코드상세
 */
const createDetail = (cdId, dtl) => http.post(`${END_POINT}/${cdId}/code-details`, dtl).then(res => res);

/**
 * 코드상세를 삭제한다.
 * @param { String } cdId 코드 식별자
 * @param { String[] } dtlIds 상세식별자 목록
 */
const deleteDetail = (cdId, dtlIds) => http.delete(`${END_POINT}/${cdId}/code-details/${dtlIds}`).then(res => res);

/**
 * 코드상세를 수정한다.
 * @param { String } cdId 코드 식별자
 * @param { String } dtlIds 상세식별자 목록
 * @param { Object } dtl 코드상세
 */
const updateDetail = (cdId, dtlId, dtl) => http.put(`${END_POINT}/${cdId}/code-details/${dtlId}`, dtl).then(res => res);

export {
    getAllDetailCode,
    createDetail,
    deleteDetail,
    updateDetail,
}
