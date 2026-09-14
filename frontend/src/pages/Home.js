import './Home.css'
import SearchBar from '../components/SearchBar'

const Home = () => {
    return (
        <div className="home">
                <div className="home-banner-section">
                    <div className='search'>
                        <SearchBar />
                    </div>

                    <div className='banner'>
                        <img src='/assets/banner.jpg' id='banner'/>
                        <h3>Not sure where to go? Perfect.</h3>
                        <button>I'm flexible</button>
                    </div>
                </div>

                <div className='nonbanner-section'>
                    <h2>Inspiration for your next trip</h2>
                    <div className='inspiration-cards'>
                        <card className="card">
                            <img src='https://a0.muscache.com/im/pictures/Mt/MtTemplate-6616500/original/f024af85-cf43-455a-a7af-543839982ca8.jpeg?im_w=960' />
                            <div className='card-text'>
                                <h4>Paris</h4>
                                <h5>France</h5>
                            </div>
                        </card>

                        <card className="card">
                            <img src='https://a0.muscache.com/im/pictures/Mt/MtTemplate-577058/original/004fe20d-a325-469c-bc95-d852cf45d5fd.jpeg?im_w=720' />
                            <div className='card-text'>
                                <h4>New York</h4>
                                <h5>USA</h5>
                            </div>
                        </card>

                        <card className="card">
                            <img src='https://a0.muscache.com/im/pictures/Mt/MtTemplate-6863618/original/08a687ad-fda1-4065-b4e0-eee440e90cf4.jpeg?im_w=720' />
                            <div className='card-text'>
                                <h4>Tokyo</h4>
                                <h5>Japan</h5>
                            </div>
                        </card>

                        <card className="card">
                            <img src='https://a0.muscache.com/im/pictures/Mt/MtTemplate-1668069/original/0e857735-ae8c-482e-b5cf-7fc8f94de4b8.jpeg?im_w=480' />
                            <div className='card-text'>
                                <h4>Cape Town</h4>
                                <h5>South Africa</h5>
                            </div>
                        </card>

                        <card className="card">
                            <img src='https://a0.muscache.com/im/pictures/Mt/MtTemplate-6598095/original/10163f9a-a4de-4da5-bcc2-94a61fc3a181.jpeg?im_w=480' />
                            <div className='card-text'>
                                <h4>Phuket</h4>
                                <h5>Thailand</h5>
                            </div>
                        </card>
                    </div>
                    <h2>Discover Airbnb Experiences</h2>

                    <div className='experiences-card-section'>
                        <card className="experience-card">
                            <img src='https://a0.muscache.com/im/pictures/Mt/MtTemplate-6598098/original/eee2b644-11c8-492d-aba4-c8096b8023bd.jpeg?im_w=720' />
                            <div className='experience-card-text'>
                                <h2>Things to do on your trip</h2>
                                <button>Experiences</button>
                            </div>
                        </card>

                        <card className="experience-card">
                            <img src='https://a0.muscache.com/im/pictures/Mt/MtTemplate-6598098/original/726db611-8f93-4a69-9139-10d40cabcbaa.jpeg?im_w=720' />
                            <div className='experience-card-text'>
                                <h2>Things to do from home</h2>
                                <button>Online Experiences</button>
                            </div>
                        </card>
                    </div>

                    <div className='gift-card'>
                        <div className='gift-card-text'>
                            <h3>Shop Airbnb gift cards</h3>
                            <button>Learn more</button>
                        </div>
                        <div className='gift-card-image'>
                            <img src='/assets/gift-cards.png' alt='Airbnb gift cards' />
                        </div>
                    </div>

                    <div className='question-section'>
                        <card className="question-card">
                            <div className='question-text'>
                                <h1>
                                    <span>Questions</span> <br></br>
                                    <span>about</span> <br></br>
                                    <span>hosting?</span>
                                </h1>
                                <button>Ask a super host</button>
                            </div>
                            
                            <img src='https://a0.muscache.com/im/pictures/Mt/MtTemplate-4275166/original/fa1e595f-9b72-4d47-9ecc-631229dfb090.jpeg?im_w=960'/>
                        </card>
                        
                        
                    </div>

                    <h3>Inspiration for future getaways</h3>

                    <div className='home-footer-menu'>
                        <p>Destinations for art and culture</p>
                        <p>Destinations for outdoor adventure</p>
                        <p>Mountain cabin</p>
                        <p>Beach destinations</p>
                        <p>Popular destinations</p>
                        <p>Unique stays</p>
                    </div>

                    <div className='home-footer-list'>
                        <div>
                            <h4>Eiffel Tower</h4>
                            <p>Paris, France</p>
                            <h4>Collosseum</h4>
                            <p>Rome, Italy</p>
                            <h4>Great Wall</h4>
                            <p>Beiging, China</p>
                        </div>
                        <div>
                            <h4>Statue Of Liberty</h4>
                            <p>New York, USA</p>
                            <h4>Sydney Opera House</h4>
                            <p>Sydney, Australia</p>
                            <h4>Christ the Redeemer</h4>
                            <p>Rio de Jeneiro, Brazil</p>
                        </div>
                        <div>
                            <h4>Shibuya Crossing</h4>
                            <p>Tokyo, Japan</p>
                            <h4>Table Mountain</h4>
                            <p>Cape Town, South Africa</p>
                            <h4>Santorini</h4>
                            <p>Santorini, Greece</p>
                        </div>
                        <div>
                            <h4>Big Ben</h4>
                            <p>London, UK</p>
                            <h4>Sagrada Familia</h4>
                            <p>Barcelona, Spain</p>
                            <h4>Grand Canyon</h4>
                            <p>Arizona, USA</p>
                        </div>
                    </div>

                </div>

                
            
        
        </div>
    )
}

export default Home