import { Link } from 'react-router-dom';
import appStore from "../../assets/images/coming-soon-to-apple.jpeg";
import googlePlay from "../../assets/images/coming-soon-to-googleplay.jpeg";

export default function Footer() {
    return(
        <footer>
            <div className='flex xs:flex-col sm:flex-row justify-between bg-[rgb(7,57,106)] xs:h-[30%] sm:h-[76px] w-full lg:fixed bottom-0 z-10'>
                <div className="flex xs:flex-col sm:flex-row items-center xs:p-8 sm:p-4">
                    {/* <ul className='flex xs:flex-col sm:flex-row xs:space-y-8 sm:space-x-8'>
                        <Link to='/privacy-policy' className="border-b border-gray-400 uppercase">
                            <li className='text-md text-white'>Privacy Policy</li>
                        </Link>

                        <Link to='/delete-profile-instructions' className="border-b border-gray-400 uppercase">
                            <li className='text-md text-white'>Delete Profile Instructions</li>
                        </Link>

                        <Link to='/contact-us' className="border-b border-gray-400 uppercase">
                            <li className='text-md text-white'>Contact Us</li>
                        </Link>
                    </ul> */}
                </div>
                <div className="flex xs:flex-col sm:flex-row items-center p-4">
                    <ul className='flex xs:flex-col sm:flex-row xs:space-y-8 sm:space-x-8'>
                        <li>
                            <a href="https://play.google.com/store/apps/details?id=com.aunsh.todo_list" target='_blank'>
                                <img src={googlePlay} alt="Available now on the Google Play" className='h-[50px]'/>
                            </a>
                        </li>

                        <li>
                            <a href="https://apps.apple.com/us/app/the-todo-list-pro-organiser/id6748808550" target='_blank'>
                                <img src={appStore} alt="Available now on the App Store" className='h-[50px]'/>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}