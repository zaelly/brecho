import {useEffect, useState } from 'react'
import './DescriptionBox.css'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const DescriptionBox = ({ product }) => {
    const [widthResize, setWindowWidth] = useState(window.innerWidth);
    const [reviews, setReviews] = useState(product?.reviews || []);
    const [isLoading, setIsLoading] = useState(false);
    const [existReview, setExistReview] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedReview, setEditedReview] = useState({});
    const [userLog, setUserLog] = useState(false);
    const url = import.meta.env.VITE_API_URL || 'http://localhost:4000';

    const [sendReview, setSendReview] = useState({
        productId: product?._id,
        rating: '',
        comment: ''
    })

    const verifyLogUser = ()=>{
        const logId = localStorage.getItem('auth-token');
        const logAuth = localStorage.getItem('users-id');
        return !!(logId && logAuth)
    }

    const toggleReview = () => {
        setExistReview(prev => !prev)
    }

    // adiciona uma review limpa
    const addReviewText = (e)=>{
        const {name, value} = e.target
        setSendReview((prev)=>({
            ...prev,
            [name] : value
        }))
    }

    // adiciona com sucesso a review
    const successHandle =()=>{
        toast.success("Avaliação Adicionada!");
        setSendReview({
            productId: product._id || '',
            rating: '',
            comment: ''
        })
    }

    const add_review = async ()=>{
        const {comment, productId, rating} = sendReview;
        setIsLoading(true); 

        if (!productId || productId.trim() === '') {
            toast.error("ID do produto está ausente. Tente novamente.");
            return;
        }

        if (!comment.trim()) {
            toast.warn("Comentário não pode estar vazio.");
            return;
        }

        try{
            const response = await fetch(`${url}/api/products/addreviews`, {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                    'Content-Type':'application/json',
                    'auth-token': localStorage.getItem("auth-token")
                },
                body: JSON.stringify({comment, productId, rating})
            })

            const data = await response.json();
            if(data.success){
                successHandle();
                setReviews(data.product.reviews || []);
            }else {
                toast.error(data.message || "Erro ao adicionar review.");
            }
        } catch (err) {
            console.error("Erro:", err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEditChange = (e, id) => {
        const { name, value } = e.target;
        setEditedReview(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [name]: value
            }
        }));
    };

    // salva a review editada
    const saveEditedReview = async (productId, reviewId) => {
        const reviewToUpdate = editedReview[reviewId];
       
        if (!reviewToUpdate) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${url}/api/products/updatereview`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    reviewId,
                    productId,
                    comment: reviewToUpdate.comment,
                    rating: reviewToUpdate.rating
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Avaliação atualizada!");
                setEditingReviewId(null);
                setEditedReview(prev=>{
                    const updated = {...prev};
                    delete updated[reviewId];
                    return updated
                })
                setReviews(data.product.reviews || []);
            } else {
                toast.error("Erro ao editar avaliação");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleSize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleSize);

        setUserLog(verifyLogUser());

        const interval = setInterval(() => {
            setUserLog(verifyLogUser());
        }, 1000);


        if (product && product._id) {
            setSendReview(prev => ({ ...prev, productId: product._id }));

            fetch(`${url}/api/products/getreviews/${product._id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem("auth-token")
                }
            })
            .then(response => response.json())
            .then(data => {
                setReviews(Array.isArray(data) ? data : data.reviews || []);
            })
            .catch(err => console.error(err));
        }

        return () => {
            window.removeEventListener("resize", handleSize)
            clearInterval(interval)
        };
    }, [product]);

    const removeFromReview = (productId, reviewId)=>{
        if(localStorage.getItem('auth-token')){
            fetch(`${url}/api/products/removefromreview`,{
                method: 'POST',
                headers: {
                    Accept:'application/json',
                    'Content-Type':'application/json',
                    'auth-token': localStorage.getItem("auth-token")
                },
                body:JSON.stringify({productId, reviewId})
            })
            .then((response)=>response.json())
            .then(data => {
                console.log(data)
                if (data.success) {
                    toast.success("Review excluída!");
                    setReviews(data.product.reviews || []);
                } else {
                    toast.error("Erro ao remover avaliação.");
                }
            })
            .catch(err => console.error(err));
            }
    }
    
   return (
        <div className="descriptionbox">
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">{reviews.length} Avaliações</div>
            </div>

            <div className="descriptionbox-description">
                <h2>Avaliações</h2>
                <hr className='traco'/>
                {Array.isArray(reviews) && reviews.length === 0 ? (
                    <p>Sem avaliações ainda.</p>
                ) : (
                    <ul className='container-review'>
                        {reviews.map((review) => {
                            const userOwner = userLog && String(review.userId) === String(localStorage.getItem("users-id"));

                            return (
                                <li key={review._id} className="liComment">
                                    <div className="comment">
                                        <div className="headerAll">
                                            <div className="headerStar">
                                                <strong className='nameUser'>{review.name}</strong>-
                                                {editingReviewId === review._id ? (
                                                    <select
                                                        name="rating"
                                                        value={editedReview[review._id]?.rating || review.rating}
                                                        onChange={(e) => handleEditChange(e, review._id)}
                                                    >
                                                        <option value="1">⭐</option>
                                                        <option value="2">⭐⭐</option>
                                                        <option value="3">⭐⭐⭐</option>
                                                        <option value="4">⭐⭐⭐⭐</option>
                                                        <option value="5">⭐⭐⭐⭐⭐</option>
                                                    </select>
                                                ) : (
                                                    <span>{'⭐'.repeat(review.rating)}</span>
                                                )}
                                            </div>

                                            {userOwner && (
                                                <div className="btnEdit">
                                                    <div className="btns">
                                                        <button
                                                            className="editReview"
                                                            onClick={() => {
                                                                if (editingReviewId === review._id) {
                                                                    saveEditedReview(product._id, review._id);
                                                                } else {
                                                                    setEditingReviewId(review._id);
                                                                    setEditedReview(prev => ({
                                                                        ...prev,
                                                                        [review._id]: {
                                                                            rating: review.rating,
                                                                            comment: review.comment
                                                                        }
                                                                    }));
                                                                }
                                                            }}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading
                                                                ? 'Salvando...'
                                                                : editingReviewId === review._id
                                                                ? 'Salvar'
                                                                : 'Editar'}
                                                        </button>

                                                        {editingReviewId === review._id && (
                                                            <button
                                                                className='cancelEditReview'
                                                                onClick={() => {
                                                                    setEditingReviewId(null);
                                                                    setEditedReview(prev => ({
                                                                        ...prev,
                                                                        [review._id]: undefined
                                                                    }));
                                                                }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        )}

                                                        <i
                                                            className="fa-solid fa-trash"
                                                            onClick={() => removeFromReview(product._id, review._id)}
                                                            role="button"
                                                            tabIndex="0"
                                                        ></i>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <br />
                                        {editingReviewId === review._id ? (
                                            <input
                                                className='editReviewInput'
                                                type="text"
                                                name="comment"
                                                value={editedReview[review._id]?.comment || review.comment}
                                                onChange={(e) => handleEditChange(e, review._id)}
                                            />
                                        ) : (
                                            <em className='textReviewUx'>{review.comment}</em>
                                        )}
                                    </div>
                                    <hr/>
                                </li>
                            )
                        })}
                    </ul>
                )}

                { userLog && (
                    <>
                        <button type='button'
                            className={`reviewButton ${existReview ? 'hide' : 'show'}`}
                            onClick={toggleReview}
                        >
                            Adicionar avaliação
                        </button>
                    
                        <hr className='traco'/>

                        <div className={`textReview ${existReview ? 'show' : 'hide'}`}>
                            <div className="stars">
                                <p>Adicione sua avaliação abaixo!</p>
                                <select
                                    name="rating"
                                    className="stars_select"
                                    value={sendReview.rating}
                                    onChange={addReviewText}
                                >
                                    <option value="1">⭐</option>
                                    <option value="2">⭐⭐</option>
                                    <option value="3">⭐⭐⭐</option>
                                    <option value="4">⭐⭐⭐⭐</option>
                                    <option value="5">⭐⭐⭐⭐⭐</option>
                                </select>
                            </div>
                            <textarea
                                name="comment"
                                className="addReview"
                                value={sendReview.comment}
                                onChange={addReviewText}
                            ></textarea>
                            <div className="btnEnviar">
                                <button className="EnterReview" onClick={add_review}>
                                    Enviar Review
                                </button>
                                <button className="cancelReview" onClick={
                                    ()=>setExistReview(false)
                                }>
                                    Cancelar Review
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DescriptionBox