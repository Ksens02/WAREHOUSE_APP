from sqlmodel import Session, select
from models import Inventory, engine

with Session(engine) as session:
    statement = select(Inventory).where(Inventory.product_id == 1)
    basketball = session.exec(statement).one()

    print(basketball)

    basketball.quantity_in_stock += 55

    session.add(basketball)
    session.commit()
    session.refresh(basketball)
    print(basketball)

