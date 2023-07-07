import styles from './Info.module.scss'

const Info = () => {
    return (
        <div className={styles.info}>
            <div className={styles.container + ' container'}>
                <div className={styles.consultation}>
                    <img src="./img/map-point.png" alt="point" />
                    <p>
                        м. Львів вул. Стуса 37 | Пн-Сб: 8:00-20:00
                    </p>
                    <button>запис на консультацію</button>
                </div>
                <div className={styles.number}>
                    <p>999 99 99 999</p>
                </div>
                <div className={styles.social}>
                    <a href="/">
                        <div>
                            <img src="./img/facebook_info.png" alt="" />
                        </div>
                    </a>
                    <a href="/">
                        <div>
                            <img src="./img/insta.png" alt="" />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Info;