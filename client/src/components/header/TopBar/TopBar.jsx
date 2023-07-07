import styles from './TopBar.module.scss'

const TopBar = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container + " container"}>
                <ul className={styles.list}>
                    <li>
                        <a className={styles.text} href="/">Про центр</a>
                    </li>
                    <li>
                        <a className={styles.text} href="/">Акції</a>
                    </li>
                    <li>
                        <a className={styles.text} href="/">Відгуки</a>
                    </li>
                    <li>
                        <a className={styles.text} href="/">Вакансії</a>
                    </li>
                    <li>
                        <a className={styles.text} href="/">ПРАВИЛА ВІДВІДУВАННЯ ЦЕНТРУ</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default TopBar;