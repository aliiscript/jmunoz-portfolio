import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Prismic from "prismic-javascript";
import "../styles/gallery-styles/gallery.scss";
import "../styles/gallery-styles/loading-gallery.scss";

const GalleryItem = dynamic(() => import("./SessionGalleryItem"));
const SideVizImageAware = dynamic(() => import("./SideVizImageAware"));
const VizImageAware = dynamic(() => import("./VizImageAware"));
const AwareGalleryItem = dynamic(() => import("./AwareGalleryItem"));
const BtmGallery = dynamic(() => import("../components/BtmGallery"));
const Loader = dynamic(() => import("./Loader"));

export default function Gallery({ sessionName, setCanScroll }) {

    const apiEndpoint = 'https://jmunoz-portfolio.cdn.prismic.io/api/v2';
    const accessToken = '';
    const Client = Prismic.client(apiEndpoint, { accessToken });
    const [galleryItems, setGalleryItemsData] = useState(null);

    const [visiblePic, setVisiblePic] = useState(null);
    const [isPicVisible, setIsPicVisible] = useState(false);

    console.log("Big Pic:");
    console.log(visiblePic);
    console.log(isPicVisible);

    const [visiblePicSide, setVisiblePicSide] = useState(null);
    const [isPicVisibleSide, setIsPicVisibleSide] = useState(false);

    const [focusedPic, setFocusedPic] = useState(" ");

    useEffect(() => {
        const fetchData = async () => {
            const response = await Client.query(
                Prismic.Predicates.at('document.type', sessionName.toLowerCase())
            )
            if (response) {
                setGalleryItemsData(response.results)
            }
        }
        fetchData()
    }, [])

    return !galleryItems ?
        <div className="loading-container">
            <div className="loading-txt-container">
                <h1 className="loading-txt">JUAN MUNOZ</h1>
            </div>
        </div> :
        (
            <>
                <Loader setCanScroll={setCanScroll} />
                <section className="gallery-side-scroll">
                    {

                        galleryItems.map((item, index) => (
                            <motion.span className={`gallery-side-span-${index}`}>
                                <SideVizImageAware
                                    visiblePic={visiblePic}
                                    setVisiblePicSide={setVisiblePicSide}
                                    setIsPicVisibleSide={setIsPicVisibleSide}
                                    classN={"gallery-side-pic"}
                                    img={item.data.shoot_image.url}
                                    index={index} />
                            </motion.span>
                        ))
                    }
                </section>

                <div className="gallery-wrapper">
                    {

                        galleryItems.map((item, index) => (
                            <AwareGalleryItem
                                setVisiblePic={setVisiblePic}
                                setIsPicVisible={setIsPicVisible}
                                img={item.data.shoot_image.url}
                                index={index}
                            />

                        ))
                    }
                </div>

                <BtmGallery galleryItems={galleryItems} />
            </>
        )
}
