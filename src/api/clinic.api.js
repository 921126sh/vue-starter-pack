import http from './http-client';
const END_POINT = '/clinics';

/**
 * 이력 목록을 조회한다.
 * @param { Object =>
    contentTitle?: string,
    majorNm?: string
    drNm?: string
    ptNm?: string
    dates?: string[]
 * } param 조회조건
 */
const getAllClinic = (param) => http.get(`${END_POINT}`, { params: param }).then(res => res.data.data ? res.data.data.clinicResponses : []);

/**
 * 이력의 컨텐츠 목록을 조회한다.
 * @param { String } clinicId 클리닉 식별자
 */
const getAllClinicContent = (clinicId) => http.get(`${END_POINT}/${clinicId}/contents`).then(res => res.data.data ? res.data.data.clinicContents : []);

/**
 * 이력의 사용량 목록을 조회한다.
 * @param { Object =>
    majorNm?: string
    drNm?: string
 * } param 조회조건
 */
const getAllClinicUsage = (param) => http.get(`${END_POINT}/usage`, { params: param }).then(res => res.data.data ? res.data.data.clinicUsageResponses : []);

/**
 * 의사의 진료교육 목록을 조회한다.
 * @param { String } drId 의사식별자
 */
const getAllClinicContentCnt = (drId) => http.get(`${END_POINT}/contents`, { params: drId }).then(res => res.data.data ? res.data.data.clinicContentResponses : []);

/**
 * 의사의 컨텐츠 사용회수 목록을 조회한다.
 * @param { String } drId 의사식별자
 */
const getAllClinicUsageCnt = (drId) => http.get(`${END_POINT}/contents/usage`, { params: drId }).then(res => res.data.data ? res.data.data.clinicContentUsageResponses : []);

export {
    getAllClinic,
    getAllClinicContent,
    getAllClinicUsage,
    getAllClinicContentCnt,
    getAllClinicUsageCnt,
}
