import { body } from 'express-validator'

export const loginValidation = [
    body('email', 'Неправильний формат пошти').isEmail(),
    body('password', 'Пароль повинен бути мінімум 5 символів').isLength({ min: 5 }), 
];

export const registerValidation = [
    body('email', 'Неправильний формат пошти').isEmail(),
    body('password', 'Пароль повинен бути мінімум 5 символів').isLength({ min: 5 }),
    body('fullName', "Вкадіть ім'я").isLength({ min: 3 }),
    body('avatarUrl', 'Неправильне посилання на аватарку').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Заголовок статті').isLength({ min: 3 }).isString(),
    body('text', 'Текст статті').isLength({ min: 5 }).isString(),
    body('tags', "Неправильний формат тегів (введіть масив)").optional().isString(),
    body('imageUrl', 'Неправильне посилання на зображення').optional().isString(),
];