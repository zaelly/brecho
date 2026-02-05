import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
export const AdminContext = createContext(null);

const AdminContextProvider = (props) =>{
    const url = import.meta.env.VITE_API_URL;
    const [allproducts, setAllProducts] = useState([]);
    const [profileDetail, setProfileDetail] = useState({
        name: '',
        image: '',
        email: 'email',
        new_password: '',
        shopDescription: '',
        produtos_vendidos: 0,
        stars: 0,
        gateways: [],
    });
    const [gallery, setGallery] = useState([])
    const [thumbnail, setThumbnail] = useState(null)
    const [productDetails, setProductDetails] = useState({
        name:"",
        thumbnail:"",
        gallery:"",
        category: "Feminina",
        current_price: "",
        new_price: "",
        old_price: "",
        unit: "",
        sellerId: "",
        enable: false,
        inOffer: false,
        size: [],
        descriptionProduct: "",
        marca: '',
        conditions: ''
    })
    let offer = productDetails.inOffer;
    const [loading, setLoading] = useState(false);

    const Add_product = async ()=>{
        if(loading) return;
        setLoading(true);
        try{

            let product = { ...productDetails };

            product.unit = Number(product.unit);

            product.old_price = product.old_price ? Number(product.old_price) : undefined;
            product.new_price = product.new_price ? Number(product.new_price) : undefined;
            product.current_price = product.current_price ? Number(product.current_price) : undefined;

            if (product.inOffer) {
                product.current_price = undefined;
                if (!product.old_price || !product.new_price) {
                toast.warn("Preço antigo e preço de oferta são obrigatórios para produtos em oferta.");
                return;
                }
                if(product.new_price > product.old_price){
                toast.warn("Preço antigo é MENOR que preço de oferta altere o valor!.");
                return;
                }
            } else {
                product.old_price = undefined;
                product.new_price = undefined;
                if (!product.current_price) {
                toast.warn("Preço atual é obrigatório para produtos sem oferta.");
                return;
                }
            }
            gallery.forEach(g =>{
                product.gallery = [...product.gallery, g];
            })

            if(!gallery){
                toast.warn("Adicione ao menos uma imagem adicional!");
                return;
            }

            const formData = new FormData();
            formData.append('thumbnail', thumbnail);
            gallery.forEach((file, index) => {
                formData.append('gallery', file);
            });

            console.log(product, "produto a ser enviado para upload")

            const uploadApi = await fetch(`${url}/api/products/upload-product`,{
                method:'POST',
                body: formData
            })
            const resp = await uploadApi.json();

            if(resp.success){
                product.thumbnail = resp.thumbnail;
                product.gallery = resp.gallery;

                console.log(product, "produto a ser enviado")

                const addProdutoApi = await fetch(`${url}/api/products/seller/addproduct` ,{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                    'auth-token-seller': localStorage.getItem('auth-token'),
                },
                body: JSON.stringify(product),
                })
                
                const data = await addProdutoApi.json();
                data.success ? successHandle() : toast.error("Adição de produto falhou!")
            }
        }catch(err){
            console.error("Erro ao adicionar produto:", err);
            toast.error("Erro ao adicionar produto!");
        }
        finally{
            setLoading(false);
        }
    }

    const fetchProfile = async () => {
        const res = await fetch(`${url}/api/sellers/getsellerprofile`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'auth-token-seller': localStorage.getItem("auth-token"),
        },
        });
        const data = await res.json();

        if (data.success) {
        const sellerId = data.data._id;
        setProfileDetail(prev => ({
            ...prev,
            id: data.data._id,
            name: data.data.name,
            email: data.data.email,
            shopDescription: data.data.shopDescription,
            image: data.data.image,
            produtos_vendidos: data.data.produtos_vendidos,
            stars: data.data.stars,
            gateways: data.data.gateways || [],
        }));
        localStorage.setItem("seller-id", sellerId);
        localStorage.setItem(`seller-image-${sellerId}`, data.data.image);
        } else {
        toast.error(data.errors || "Erro ao buscar perfil");
        }
    };
    
    const fetchInfo = async ()=>{
        const response = await 
        fetch(`${url}/api/products/seller/allproducts`, {
        headers: {
        'auth-token-seller': localStorage.getItem('auth-token')
        }
    })
        const data = await response.json();    
        console.log(data, "todos os produtos do seller no contexto")
        setAllProducts(data);
    }

    const remove_product = async(id) => {
        await fetch(`${url}/api/products/seller/removeproduct`, {
        method: 'POST',
        headers: {
            Accept:'application/json',
            'Content-Type':'application/json',
            'auth-token-seller': localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ id: id })
        });
        await fetchInfo();
    };

    const edit_product = async(id) =>{
        console.log("teste", id);
    };

    const handleImageThumbnail = (e)=>{
        setThumbnail(e.target.files[0]);
    }

    const handleImageGallery = (e)=>{
        const galleryFiles = Array.from(e.target.files)

        setGallery(prev => {
        const total = prev.length + galleryFiles.length;
        if(total > 5){
            toast.warn("Limite de Imagens Adicionais Atingido!")
            return prev;
        }

        return [...prev, ...galleryFiles]
        })
    }

    const handleChange = (e) =>{
        const {name, type, checked} = e.target;

        if (type === "checkbox" && name.startsWith("size")) {
            const sizeLabel = name.replace("size", ""); // ex: "PP"
            setProductDetails((prev) => {
            const updatedSizes = checked
                ? [...prev.size, sizeLabel]
                : prev.size.filter((s) => s !== sizeLabel);

            return {
                ...prev,
                size: updatedSizes,
            };
        });
        } else {
            setProductDetails((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : e.target.value,
            }));
        }
    }

    const successHandle = ()=>{
        toast.success("Produto Adicionado!");
        setProductDetails({
            name:"",
            thumbnail:"",
            gallery: "",
            category: "Feminina",
            current_price: "",
            new_price: "",
            old_price: "",
            sellerId: "",
            unit: "",
            enable: false,
            inOffer: false,
            size: [],
            descriptionProduct: "",
            marca: '',
            conditions: ''
        })
    }
    
    useEffect(()=>{
        const sellerId = localStorage.getItem('seller-id');
        if (sellerId) {
            setProductDetails(prev => ({ ...prev, sellerId }));
        }
    },[productDetails.sellerId])

    useEffect(() => {
        return () => {
            gallery.forEach(img => URL.revokeObjectURL(img));
        };
    }, [gallery]);

    useEffect(()=>{
        fetchInfo();
    },[])

    const contextValue = {
        fetchProfile, offer, loading, handleChange, Add_product, setGallery, handleImageGallery, setThumbnail, handleImageThumbnail, gallery, productDetails, setProductDetails, thumbnail, setProfileDetail, remove_product, edit_product, url, allproducts, profileDetail, fetchInfo, setAllProducts,
    }
    return(
        <AdminContext.Provider value={contextValue}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider