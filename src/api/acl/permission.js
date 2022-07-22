import request from '@/utils/request'

/* 
权限管理相关的API请求函数
*/

export const removePermission = (id) => request({ url: `/admin/acl/permission/remove/${id}`, method: 'delete' })


export const addPermission = (permission) => request({ url: '/admin/acl/permission/save', method: 'post', data: permission })


export const updatePermission = (permission) => request({ url: '/admin/acl/permission/update', method: 'put', data: permission })


export const doAssign = (roleId, permissionId) => request({ url: `/admin/acl/permission/doAssign`, method: 'post', params: { roleId, permissionId } })


export const getPermissionList = () => request({ url: '/admin/acl/permission', method: 'get' })


export const toAssign = (roleId) => request({ url: `/admin/acl/permission/toAssign/${roleId}`, method: 'get' })