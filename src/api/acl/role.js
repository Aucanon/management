/* 
角色管理相关的API请求函数
*/
import request from '@/utils/request'

export const getInfoList = (page, limit, searchObj) => request({ url: `/admin/acl/role/${page}/${limit}`, method: 'get', params: searchObj })


/* 
    获取某个角色
    */
export const getById = (id) => request({ url: `/admin/acl/role/get/${id}`, method: 'get' })


/* 
更新一个角色
*/
export const updateById = (role) => request({ url: '/admin/acl/role/update', method: 'put', data: role })


/* 
   保存一个新角色
   */
export const save = (role) => request({ url: '/admin/acl/role/save', method: 'post', data: role })


/* 
   获取一个角色的所有权限列表
   */
export const getAssign = (roleId) => request({ url: `/admin/acl/role/toAssign/${roleId}`, method: get })


/* 
   删除某个角色
   */
export const removeById = (id) => request({ url: `/admin/acl/role/remove/${id}`, method: 'delete' })


/* 
  批量删除多个角色
  */
export const removeRoles = (ids) => request({ url: '/admin/acl/role/batchRemove', method: 'delete', data: ids })