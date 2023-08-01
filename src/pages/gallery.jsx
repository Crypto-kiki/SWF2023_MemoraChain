import { AccountContext } from "../AccountContext";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../web3.config";
import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useCursor,
  MeshReflectorMaterial,
  Image,
  Text,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useRoute, useLocation, Link } from "wouter";
import { easing } from "maath";
import getUuid from "uuid-by-string";
import {
  useLocation as useSchoolLocation,
  useNavigate,
} from "react-router-dom"; // useRoute 대신 useLocation 사용
import { Html } from "@react-three/drei";
import { Avartar } from "../components/Avatar";
import CameraControls from "../components/CameraControls";
import { IoCameraReverseOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";

const GOLDENRATIO = 1.61803398875;

const Gallery = () => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  const { account, setAccount } = useContext(AccountContext);
  const [tokenIds, setTokenIds] = useState([]);
  const [tokenIdsWithMetadataUris, setTokenIdsWithMetadataUris] = useState({});
  const [arrayOfImageUrls, setArrayOfImageUrls] = useState([]);
  const [arrayOfCountry, setArrayOfCountry] = useState([]);
  const [arrayOfCity, setArrayOfCity] = useState([]);
  const [arrayOfAddress, setArrayOfAddress] = useState([]);
  const [arrayOfWeather, setArrayOfWeather] = useState([]);

  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(false);
  const [popup, setPopup] = useState(false);
  const [start, setStart] = useState(true);
  const [menu, setMenu] = useState(false);
  const [wide, setWide] = useState([]);
  const [length, setLength] = useState([]);
  // const [sizetype, setSizetype] =useState();

  const connectWithMetamask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts) {
        setAccount(accounts[0]);
      }
      if (parseInt(window.ethereum.networkVersion) !== 11155111) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
      alert("계정 정보를 불러오는데 실패하였습니다.");
    }
  };

  useEffect(() => {
    connectWithMetamask();
  }, []);

  const history = useNavigate(); // useHistory 훅을 사용하여 history 객체를 가져옴

  const handleHomeClick = () => {
    // Home 버튼 클릭 시 Three.js 씬을 언마운트
    history("/"); // 메인 페이지로 이동
  };

  useEffect(() => {
    getMyNfts();
    console.log(tokenIds);
  }, [account]);

  const getMyNfts = async () => {
    try {
      const response = await contract.methods.getAllNft(account).call();
      const tempArray = response.map((v) => Number(v));
      setTokenIds(tempArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (tokenIds.length > 0) {
      getTokenUris();
    }
  }, [tokenIds]);

  const loadImageSize = (imageUrl) =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error("Failed to load image size"));
    });

  const getTokenUris = async () => {
    try {
      const uris = {};
      const Country = [];
      const City = [];
      const Address = [];
      const Weather = [];
      const wide2 = [];
      const length2 = [];
      const token = [];

      for (let i = 0; i < tokenIds.length; i++) {
        const metadataUri = await contract.methods
          .metadataUri(tokenIds[i])
          .call();
        const response = await axios.get(metadataUri); // URI를 사용하여 이미지 데이터를 가져옴
        const imageUrl = response.data.image;

        const size = await loadImageSize(imageUrl);
        if (size.width > size.height) {
          wide2.push(imageUrl);
        } else {
          length2.push(imageUrl);
        }
        // uris[imageUrl] = tokenIds[i];
        // token.push(tokenIds[i]);
        // // 이미지 URL들을 배열로 추출
        // const imageUrlArray = Object.keys(uris);
        // // 추출한 이미지 URL 배열을 state에 저장
        // //eqe
        // setArrayOfImageUrls(imageUrlArray);
        const Metadata = response.data.attributes;
        Country.push({
          country: Metadata[2].value,
          tokenId: tokenIds[i],
        });
        City.push({
          city: Metadata[3].value,
          tokenId: tokenIds[i],
        });
        Address.push({
          address: Metadata[4].value,
          tokenId: tokenIds[i],
        });
        Weather.push({
          weather: Metadata[5].value,
          tokenId: tokenIds[i],
        });
        setArrayOfCountry(Country);
        setArrayOfCity(City);
        setArrayOfAddress(Address);
        setArrayOfWeather(Weather);
      }
      setWide(wide2);
      setLength(length2);
      setTokenIdsWithMetadataUris(uris);
    } catch (error) {
      console.error(error);
    } finally {
      // 데이터 로딩이 완료되었으므로 loading 상태를 false로 변경합니다.
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(show);
    if (!show) {
      handleHomeClick();
    }
  }, [show]);

  useEffect(() => {
    console.log(wide.length);
    console.log(length.length);
  }, [wide, length]);

  const location = useLocation();

  const createImagesArray = () => {
    const imagesArray = [];

    // tokenIds.length 만큼 반복합니다
    for (let i = 0; i < wide.length; i++) {
      const metadataItem = arrayOfCountry.find(
        (item) => item.tokenId === tokenIds[i]
      );
      const CountryValue = metadataItem ? metadataItem.country : null;
      const metadataItem2 = arrayOfCity.find(
        (item) => item.tokenId === tokenIds[i]
      );
      const CityValue = metadataItem2 ? metadataItem2.city : null;
      const metadataItem3 = arrayOfAddress.find(
        (item) => item.tokenId === tokenIds[i]
      );
      const AddressValue = metadataItem3 ? metadataItem3.address : null;
      const metadataItem4 = arrayOfWeather.find(
        (item) => item.tokenId === tokenIds[i]
      );
      const WeatherValue = metadataItem4 ? metadataItem4.weather : null;
      imagesArray.push({
        position: [-5.6 + i * 2.5, 2.5, -0.6], // 예시 position, 필요한 값으로 변경할 수 있습니다
        rotation: [0, 0, 0], // 예시 rotation, 필요한 값으로 변경할 수 있습니다
        url: wide[i],
        country: CountryValue,
        city: CityValue,
        address: AddressValue,
        weather: WeatherValue,
        sizetype: 2,
      });
    }

    for (let i = 0; i < length.length; i++) {
      const metadataItem = arrayOfCountry.find(
        (item) => item.tokenId === tokenIds[i]
      );
      const CountryValue = metadataItem ? metadataItem.country : null;
      const metadataItem2 = arrayOfCity.find(
        (item) => item.tokenId === tokenIds[i]
      );
      const CityValue = metadataItem2 ? metadataItem2.city : null;
      const metadataItem3 = arrayOfAddress.find(
        (item) => item.tokenId === tokenIds[i]
      );
      const AddressValue = metadataItem3 ? metadataItem3.address : null;
      const metadataItem4 = arrayOfWeather.find(
        (item) => item.tokenId === tokenIds[i]
      );
      const WeatherValue = metadataItem4 ? metadataItem4.weather : null;
      imagesArray.push({
        position: [-5.6 + i * 2, 0, -0.6], // 예시 position, 필요한 값으로 변경할 수 있습니다
        rotation: [0, 0, 0], // 예시 rotation, 필요한 값으로 변경할 수 있습니다
        url: length[i],
        country: CountryValue,
        city: CityValue,
        address: AddressValue,
        weather: WeatherValue,
        sizetype: 1,
      });
    }
    return imagesArray;
  };

  const images = createImagesArray();
  return (
    <>
      {loading ? (
        <div class="flex justify-center items-center h-screen bg-gray-900">
          <div class="relative">
            <div class="loading-text text-white font-bold text-3xl animate-pulse">
              Loading...
            </div>
            <div class="w-full h-1 bg-white absolute bottom-0 left-0 before:content before:block before:w-full before:h-1 before:bg-blue-500 before:animate-pulse"></div>
          </div>
        </div>
      ) : tokenIds.length === wide.length + length.length && show ? (
        <div className="w-[100vw] h-[100vh]">
          <Canvas dpr={[1, 1.5]}>
            <color attach="background" args={["#191920"]} />
            <fog attach="fog" args={["#191920", 0, 15]} />
            <group position={[0, -0.5, 0]}>
              <ambientLight color="#FFFFFF" intensity={0.5} />
              <Init
                start={start}
                setStart={setStart}
                setOrbitControlsEnabled={setOrbitControlsEnabled}
              />
              <Frames
                images={images}
                setOrbitControlsEnabled={setOrbitControlsEnabled}
                popup={popup}
                setPopup={setPopup}
                start={start}
                menu={menu}
                setMenu={setMenu}
                setShow={setShow}
              />
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                  blur={[300, 100]}
                  resolution={2048}
                  mixBlur={1}
                  mixStrength={80}
                  roughness={1}
                  depthScale={1.2}
                  minDepthThreshold={0.4}
                  maxDepthThreshold={1.4}
                  color="#050505"
                  metalness={0.5}
                />
              </mesh>
            </group>
            <Avartar />
            <Environment preset="city" />
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={80} />
            <CameraControls />
            <OrbitControls
              enabled={orbitControlsEnabled}
              target={[0, 0, 0]}
              enableZoom={true}
              enablePan={true}
              rotateSpeed={0.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              minAzimuthAngle={-Math.PI / 4}
              maxAzimuthAngle={Math.PI / 4}
              enableDamping={true}
              dampingFactor={0.1}
            />
          </Canvas>
        </div>
      ) : null}
    </>
  );
};

function Init({ start, setStart, setOrbitControlsEnabled }) {
  useFrame((state, dt) => {
    if (start) {
      easing.damp3(state.camera.position, [0, 0, 5.5], 0.1);
    }
    if (state.camera.position.z == 5.5) {
      setStart(false);
      setOrbitControlsEnabled(true);
    }
    // console.log(state.camera.position);
  });
}

function Frames({
  images,
  setOrbitControlsEnabled,
  popup,
  setPopup,
  start,
  menu,
  setMenu,
  setShow,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) {
  const ref = useRef();
  const clicked = useRef();
  const [, params] = useRoute("/gallery/:id");
  const [, setLocation] = useLocation();
  const [divon, setDivon] = useState(true);
  //

  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id);
    if (!start) {
      if (clicked.current) {
        clicked.current.parent.updateWorldMatrix(true, true);
        if (images.sizetype == 1) {
          clicked.current.parent.localToWorld(
            p.set(0.7, GOLDENRATIO / 2, 1.25)
          );
        } else {
          clicked.current.parent.localToWorld(p.set(1, GOLDENRATIO / 4, 1.25));
        }
        clicked.current.parent.getWorldQuaternion(q);
        setPopup(true);
        setMenu(true);
        setOrbitControlsEnabled(false);
      } else {
        p.set(0, 0, 5.5); // 이 부분을 추가하여 클릭시에만 p를 원래 위치로 돌아가게 함
        q.identity();
        setMenu(false);
        setOrbitControlsEnabled(true);
        const timer = setTimeout(() => {
          setPopup(false);
        }, 1500); // 0.5초 후에 setPopup(false) 호출
        return () => clearTimeout(timer);
        // setPopup(false);
      }
    }
  });

  useFrame((state, dt) => {
    if (popup) {
      easing.damp3(state.camera.position, p, 0.5, dt);
      easing.dampQ(state.camera.quaternion, q, 1, dt);
    }
    if (state.camera.position.z > 5.4 && state.camera.position.z < 5.6) {
      setDivon(true);
    } else {
      setDivon(false);
    }
  });

  return (
    <group
      ref={ref}
      onClick={(e) => (
        e.stopPropagation(),
        setLocation(
          clicked.current === e.object
            ? "/gallery"
            : "/gallery/" + e.object.name
        )
      )}
      onPointerMissed={() => setLocation("/gallery")}
    >
      {images.map(
        (props) => <Frame menu={menu} key={props.url} {...props} /> /* prettier-ignore */
      )}
      <Html position={[p, p, 0]}>
        {/* <button className='bg-white px-2 font-bold text-black rounded-md ml-4 mt-4 border-2 text-md white-space: normal;' onClick={() => setPopup(true)}>Reset</button> */}
        <div className="flex">
          <button
            onClick={() => setShow(false)}
            className="text-white px-2 ml-4 mt-4"
          >
            <AiOutlineHome size={33} />
          </button>
          <button
            onClick={() => setPopup(true)}
            className="text-white px-2 ml-4 mt-4"
          >
            <IoCameraReverseOutline size={33} />
          </button>
        </div>
        {divon && (
          <>
            <div className="flex flex-col ml-4 mt-4 ">
              <div className="text-white text-2xl font-bold ">Memora Chain</div>
              <div className="text-white text-2xl ">MetaVerseGallery</div>
            </div>
          </>
        )}
      </Html>
    </group>
  );
}

function Frame({
  menu,
  sizetype,
  p,
  country,
  city,
  address,
  weather,
  url,
  c = new THREE.Color(),
  ...props
}) {
  const image = useRef();
  const frame = useRef();
  const [, params] = useRoute("/gallery/:id");
  const [hovered, hover] = useState(false);
  const [rnd] = useState(() => Math.random());
  const name = getUuid(url);
  // const title2 = title;
  const isActive = params?.id === name;
  useCursor(hovered);
  useFrame((state, dt) => {
    // image.current.material.zoom =
    //   2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
    easing.damp3(
      image.current.scale,
      [
        0.85 * (!isActive && hovered ? 0.85 : 1),
        0.9 * (!isActive && hovered ? 0.905 : 1),
        1,
      ],
      0.1,
      dt
    );
    easing.dampC(
      frame.current.material.color,
      hovered ? "orange" : "white",
      0.1,
      dt
    );
  });
  return (
    <group {...props}>
      <spotLight
        color="#A1FE00"
        position={[0, 2, 0]}
        intensity={50}
        distance={2.5}
        angle={Math.PI}
        decay={1}
      />
      {sizetype == 1 ? (
        <>
          <mesh
            name={name}
            onPointerOver={(e) => (e.stopPropagation(), hover(true))}
            onPointerOut={() => hover(false)}
            scale={[1, GOLDENRATIO, 0.05]}
            position={[0, GOLDENRATIO / 2, 0]}
          >
            <boxGeometry />
            <meshStandardMaterial
              color="#151515"
              metalness={0.5}
              roughness={0.5}
              envMapIntensity={2}
            />
            <mesh
              ref={frame}
              raycast={() => null}
              scale={[0.9, 0.93, 0.9]}
              position={[0, 0, 0.2]}
            >
              <boxGeometry />
              <meshBasicMaterial toneMapped={false} fog={false} />
            </mesh>
            <Image
              raycast={() => null}
              ref={image}
              position={[0, 0, 0.7]}
              url={url}
              scale={[2, GOLDENRATIO * 2]}
            />
          </mesh>
          {menu && (
            <Text
              font={`${process.env.PUBLIC_URL}/font/NotoSansKR-Medium.otf`}
              maxWidth={0.75}
              anchorX="left"
              anchorY="top"
              position={[0.6, GOLDENRATIO / 2 + 0.1, 0]}
              fontSize={0.045}
              color="#C0DA8E"
            >
              {country + "\n" + city + "\n" + weather + "\n" + address}
            </Text>
          )}
        </>
      ) : (
        <>
          <mesh
            name={name}
            onPointerOver={(e) => (e.stopPropagation(), hover(true))}
            onPointerOut={() => hover(false)}
            scale={[GOLDENRATIO, 1, 0.05]}
            position={[GOLDENRATIO / 4, 0.5, 0]}
          >
            <boxGeometry />
            <meshStandardMaterial
              color="#151515"
              metalness={0.5}
              roughness={0.5}
              envMapIntensity={2}
            />
            <mesh
              ref={frame}
              raycast={() => null}
              scale={[0.9, 0.93, 0.9]}
              position={[0, 0, 0.2]}
            >
              <boxGeometry />
              <meshBasicMaterial toneMapped={false} fog={false} />
            </mesh>
            <Image
              raycast={() => null}
              ref={image}
              position={[0, 0, 0.7]}
              url={url}
              scale={[GOLDENRATIO * 2, 2]}
            />
          </mesh>
          {menu && (
            <Text
              font={`${process.env.PUBLIC_URL}/font/NotoSansKR-Medium.otf`}
              maxWidth={0.75}
              anchorX="left"
              anchorY="top"
              position={[1.3, GOLDENRATIO / 2 - 0.3, 0]}
              fontSize={0.045}
              color="#C0DA8E"
            >
              {country + "\n" + city + "\n" + weather + "\n" + address}
            </Text>
          )}
        </>
      )}
    </group>
  );
}

export default Gallery;
