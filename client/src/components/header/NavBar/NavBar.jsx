import styles from './NavBar.module.scss'


const NavBar = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container + ' container'}>
                <div className={styles.logo}>
                    <a href="/">
                        <img src='/img/logo.png' alt="logo" />
                    </a>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        <li>
                            <a href="/">головна</a>
                        </li>
                        <li className={styles.list}>
                            <a href="/">лікуємо</a>
                        </li>
                        <li className={styles.list}>
                            <a href="/">методи</a>
                        </li>
                        <li className={styles.list}>
                            <a href="/">масаж</a>
                        </li>
                        <li className={styles.list}>
                            <a href="/">фізіотерапія</a>
                        </li>
                        <li>
                            <a href="/">мрт</a>
                        </li>
                        <li>
                            <a href="/">блог</a>
                        </li>
                        <li>
                            <a href="/">контакти</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default NavBar;