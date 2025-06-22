import { useEffect, useState } from 'react'
import './DescriptionBox.css'

const DescriptionBox = ({ product }) => {
    const [widthResize, setWindowWidth] = useState(window.innerWidth);

    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [existReview, setExistReview] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedReview, setEditedReview] = useState({});
    const [userLog, setUserLog] = useState(false);
    const [sendReview, setSendReview] = useState({
        name: '',        
        productId: product._id,
        rating: '',
        comment: ''
    })

    const verifyLogUser = ()=>{
        const logId = localStorage.getItem('auth-token');
        const logAuth = localStorage.getItem('users-id');
        return !!(logId || logAuth);
    }

    const toggleReview = () => setExistReview(prev => !prev)

    const addReviewText = (e)=>{
        const {name, value} = e.target
        setSendReview((prev)=>({
            ...prev,
            [name] : value
        }))
    }

    const successHandle =()=>{
        alert("Avaliação Adicionada!");
        setSendReview({
            name: '',
            productId: product._id || '',
            rating: '',
            comment: ''
        })
    }

    const add_review = async ()=>{
        const {name, comment, productId, rating } = sendReview;
        setIsLoading(true); 

        if (!productId || productId.trim() === '') {
            alert("ID do produto está ausente. Tente novamente.");
            return;
        }

        if (!comment.trim()) {
            alert("Comentário não pode estar vazio.");
            return;
        }

        try{
            const response = await fetch(`http://localhost:4000/api/products/addreviews`, {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                    'Content-Type':'application/json',
                    'auth-token': localStorage.getItem("auth-token")
                },
                body: JSON.stringify({name, comment, productId, rating})
            })

            const data = await response.json();
            if(data.success){
                successHandle();
                setReviews(data.product.reviews || []);
            }else {
                alert(data.message || "Erro ao adicionar review.");
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

    const saveEditedReview = async (id) => {
        const reviewToUpdate = editedReview[id];
        if (!reviewToUpdate) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/updatereview', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({
                    reviewId: id, // ✅ importante enviar ID do review
                    comment: reviewToUpdate.comment,
                    rating: reviewToUpdate.rating
                })
            });

            const data = await response.json();
            if (data.success) {
                alert("Avaliação atualizada!");
                setEditingReviewId(null);
                setReviews(data.product.reviews || []);
            } else {
                alert("Erro ao editar avaliação");
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

            fetch(`http://localhost:4000/api/products/getreviews/${product._id}`, {
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

    const removeFromReview = (itemId)=>{
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/api/removefromreview',{
                method: 'POST',
                headers: {
                    Accept:'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json' 
                },
                body:JSON.stringify({itemId}),
            })
            .then((response)=>response.json())
           .then(data => {
                if (data.success) {
                   setReviews(prev => prev.filter(r => r._id !== itemId));
                } else {
                    alert("Erro ao remover avaliação.");
                }
            })
            .catch(err => console.error(err));
            }
    }
    
   return (
        <div className="descriptionbox">
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">Descrição</div>
                <div className="descriptionbox-nav-box">Avaliações ({reviews.length})</div>
            </div>

            <div className="descriptionbox-description">
                <p>{"Descrição não disponível."}</p>
            </div>

            <div className="descriptionbox-description">
                <h2>Avaliações</h2>
                {Array.isArray(reviews) && reviews.length === 0 ? (
                    <p>Sem avaliações ainda.</p>
                ) : (
                    <ul>
                        {reviews.map((review) => (
                            <li key={review._id} className="liComment">
                                <div className="comment">
                                    <strong>{review.name}</strong> - ⭐ 
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
                                        <> {review.rating}</>
                                    )}
                                    <br />
                                    {editingReviewId === review._id ? (
                                        <input
                                            type="text"
                                            name="comment"
                                            value={editedReview[review._id]?.comment || review.comment}
                                            onChange={(e) => handleEditChange(e, review._id)}
                                        />
                                    ) : (
                                        <em>{review.comment}</em>
                                    )}
                                </div>
                                <div className="btnEdit">
                                    {userLog  && (
                                        <>
                                            <button
                                                className="editReview"
                                                onClick={() => {
                                                    if (editingReviewId === review._id) {
                                                        saveEditedReview(review._id);
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
                                            <i className="fa-solid fa-trash" onClick={() => removeFromReview(product._id)} role="button" tabIndex="0"></i>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {userLog  && (  
                    <button
                        className={`textReview ${existReview ? 'hide' : 'show'}`}
                        onClick={toggleReview}
                    >
                        Adicionar avaliação
                    </button>
                )}

                <hr />
                { userLog && (
                    <div className={`textReview ${existReview ? 'show' : 'hide'}`}>
                        <div className="stars">
                            <p>Adicione uma nota!</p>
                            <select
                                name="rating"
                                className="stars_select"
                                value={sendReview.rating}
                                onChange={addReviewText}
                            >
                                <option value="">Selecione</option>
                                <option value="1">⭐</option>
                                <option value="2">⭐⭐</option>
                                <option value="3">⭐⭐⭐</option>
                                <option value="4">⭐⭐⭐⭐</option>
                                <option value="5">⭐⭐⭐⭐⭐</option>
                            </select>
                        </div>
                        <div>
                            <p>Comente abaixo</p>
                            <textarea
                                name="comment"
                                className="addReview"
                                value={sendReview.comment}
                                onChange={addReviewText}
                            ></textarea>
                        </div>
                        <button className="EnterReview" onClick={add_review}>
                            Enviar Review
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DescriptionBox