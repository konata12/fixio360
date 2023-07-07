import { body } from 'express-validator'

export const registerValidation = [
    body('email', 'Неправильний формат пошти').isEmail(),
    body('password', 'Пароль повинен бути мінімум 5 символів').isLength({ min: 5 }),
    body('fullName', "Вкадіть ім'я").isLength({ min: 3 }),
    body('avatarUrl', 'Неправильне посилання на аватарку').optional().isURL(),
];