import Item from '../Item/Item';

const ItemList = ({ items, prodEncontrado }) => {
  return (
    <div className='listadeproductos'>

      {
        items.length !== 0 ? (

          prodEncontrado.length === undefined || prodEncontrado.length === 0 ?
            items?.map((items) => {
              return (
                <Item items={items} key={items.id} />
              )
            }) : prodEncontrado?.map(itemFilter => {
              return (
                <Item items={itemFilter} key={itemFilter.id} />
              )
            })
        ) : (

          <div style={{}}>
            <h2> Lamentablemente no tenemos productos disponibles...
            </h2>
            <h4> ¡Pero no te preocupes, estamos trabajando para tener más productos pronto!</h4>

            <img src={'/assets/imagenes/logo-envio-flores.png'} width={250} height={250} alt='imagen de error' />
          </div>

        )
      }
    </div>
  )
};

export default ItemList;