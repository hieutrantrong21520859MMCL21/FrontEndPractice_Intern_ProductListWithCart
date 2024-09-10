// Get data form file .json
fetch('./data.json')
    .then(response => response.json())
    .then(products => {

        const sessionItems = document.querySelector('.container .items main');
        let cart = [];

        const renderAddToCartButton = div => {

            const node = div.querySelector('.img-btn span');

            const button = document.createElement('button');
            button.className = 'add-item';
            button.innerHTML = '<embed src="./assets/images/icon-add-to-cart.svg">Add to Cart';

            const name = div.querySelector('.info .name').textContent;
            const price = div.querySelector('.info .price').textContent.slice(1);

            button.addEventListener('click', () => {

                const item = {
                    productName: name,
                    price: price,
                    quantity: 1,
                    thumbnail: `${products.filter(i => i.name === name)[0].image.thumbnail}`
                }
    
                cart.push(item);
                renderActionButton(div, item);
                renderCart();

                console.log('hello');
            })

            node.innerHTML = '';
            node.appendChild(button);
        };

        const renderActionButton = (div, item) => {

            const node = div.querySelector('.img-btn span');
            
            const button = document.createElement('div');
            button.className = 'spinner';
            button.innerHTML = `
            <div class="decrement">

                <img src="./assets/images/icon-decrement-quantity.svg" alt="button-decrement">

            </div>

            <p>1</p>
  
            <div class="increment">

                <img src="./assets/images/icon-increment-quantity.svg" alt="button-increment">

            </div>`;

            const btnIncr = button.querySelector('.increment');
            const btnDecr = button.querySelector('.decrement');

            btnIncr.addEventListener('click', () => {

                item.quantity += 1;
                button.querySelector('p').textContent = item.quantity.toString();
                renderCart();
            });

            btnDecr.addEventListener('click', () => {

                item.quantity -= 1;

                if (!item.quantity) {

                    cart = cart.filter(i => i.productName !== item.productName);
                    renderAddToCartButton(div);
                }

                button.querySelector('p').textContent = item.quantity.toString();
                renderCart();
            })

            node.innerHTML = '';
            node.appendChild(button);
        };

        sessionItems.querySelectorAll("[class*='dessert']").forEach(div => {

            renderAddToCartButton(div);
        })

        const sessionCart = document.querySelector('.cart');
        
        const renderCart = () => {

            if (cart.length) {

                sessionCart.querySelector('.payment-area').classList.add('hidden');
                sessionCart.querySelector('.items-bill').classList.remove('hidden');

                sessionCart.querySelector('.items-bill .statistics').innerHTML = cart.map(({productName, price, quantity, thumbnail}) => 
                `
                    <div class="${productName}-purchased">
        
                        <p class="name">${productName}</p>
          
                        <img src="./assets/images/icon-remove-item.svg" alt="icon-remove">
          
                        <div class="numbers">
          
                            <p class="amount">${quantity}x</p>
                            <p class="price">@ $${price}</p>
                            <p class="sum">$${(price * quantity).toFixed(2)}</p>
          
                        </div>
          
                    </div>
        
                    <hr>
                `).join('');

                sessionCart.querySelector('.items-bill .total > p:last-child').textContent = `$${cart.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}`;

                sessionCart.querySelectorAll(".items-bill .statistics [class*='purchased'] img").forEach((btn, index) => {

                        btn.addEventListener('click', () => {
    
                            const removed = cart.splice(index, 1);

                            const div = Array.from(sessionItems.querySelectorAll("[class*='dessert']")).filter(
                                i => i.querySelector('.info .name').textContent === removed[0].productName
                            );
    
                            renderAddToCartButton(div[0]);
                            renderCart();
                        })
                    }
                )
            }
            else {
                sessionCart.querySelector('.items-bill .statistics').innerHTML = '';

                sessionCart.querySelector('.items-bill').classList.add('hidden');
                sessionCart.querySelector('.payment-area').classList.remove('hidden');
            }

            sessionCart.querySelector('p:first-child span').textContent = `(${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
        };

        const dialog = document.querySelector('dialog');

        document.getElementById('confirm').addEventListener('click', () => {
                
            dialog.querySelector('.dialog .bill-confirm').innerHTML = cart.map(({productName, price, quantity, thumbnail}) => 
            `
                <div class="${productName}-purchased">
                  
                    <img src="${thumbnail}" alt="${productName.toLowerCase().split(' ').join('-')}-thumbnail">
                  
                    <div class="numbers">

                        <p class="name">${productName}</p>

                        <p class="sum">$${(price * quantity).toFixed(2)}</p>

                        <div>
                                
                            <p class="amount">${quantity}x</p>
                            <p class="price">@ $${price}</p>

                        </div>
                  
                    </div>
                  
                </div>
                
                <hr>
            `).join('');

            dialog.querySelector('.dialog .bill-confirm').innerHTML += `
                <div class="total">

                    <p>Order Total</p>
                    <p>$${cart.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}</p>

                </div>
            `;

            dialog.showModal();
        })

        document.getElementById('close').addEventListener('click', () => {

            dialog.close();
            location.reload();
        })
    })