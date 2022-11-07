/**
 * 역할 기반 권한(role-base permission)을 위한 미들웨어
 */
import express from 'express';
import customUtill from './custom-utill.js';

/**
 * role들 중에 하나라도 만족하면 허용
 * ex)스프링시큐리티 : .antMatchers("/register/child/test").access("hasRole('ROLE_uncerti_CHILD') or hasRole('ROLE_ADMIN')")
 */
const hasRole = (...roles) => {
    // 미들웨어 반환
    return (req, res, next) => {
        const userRoles = req.userRole;
        const checkedRole = [];

        if (userRoles['admin']) {
            next();
        } else {
            for (let i in roles) {
                if (userRoles[roles[i]] === true) {
                    checkedRole.push(true);
                } else {
                    checkedRole.push(false);
                }
            }
            if (checkedRole.includes(true)) {
                next();
            } else {
                res.status(403).json({
                    ok: false,
                    message: '금지된 접근입니다',
                });
            }
        }//end of if
    };//end of return
};

export {hasRole};
