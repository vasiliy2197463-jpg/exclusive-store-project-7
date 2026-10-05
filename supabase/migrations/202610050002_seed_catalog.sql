alter table public.products
add column if not exists archived boolean not null default false;

insert into public.products (name,slug,description,category,price,old_price,stock,active,archived)
values
('HAVIT HV-G92 Gamepad','havit-hv-g92-gamepad','Game controller','Gaming',96,160,25,true,false),
('AK-900 Wired Keyboard','ak-900-wired-keyboard','Wired keyboard','Gaming',754,1160,25,true,false),
('IPS LCD Gaming Monitor','ips-lcd-gaming-monitor','Gaming monitor','Electronics',280,400,25,true,false),
('S-Series Comfort Chair','s-series-comfort-chair','Comfort chair','Furniture',300,400,25,true,false),
('The North Coat','the-north-coat','Warm coat','Clothing',262.8,360,25,true,false),
('Gucci Duffle Bag','gucci-duffle-bag','Travel bag','Accessories',962.8,1160,25,true,false),
('RGB Liquid CPU Cooler','rgb-liquid-cpu-cooler','CPU cooling system','Electronics',161.5,170,25,true,false),
('Small BookSelf','small-bookself','Compact bookshelf','Furniture',360,null,25,true,false),
('Breed Dry Dog Food','breed-dry-dog-food','Dry dog food','Pets',100,null,25,true,false),
('CANON EOS DSLR Camera','canon-eos-dslr-camera','Digital camera','Electronics',360,null,25,true,false),
('ASUS FHD Gaming Laptop','asus-fhd-gaming-laptop','Gaming laptop','Electronics',700,null,25,true,false),
('Curology Product Set','curology-product-set','Skincare set','Beauty',500,null,25,true,false),
('kids eletric car','kids-eletric-car','Electric toy car','Toys',960,null,25,true,false),
('Jr. Zoom Soccer Cleats','jr-zoom-soccer-cleats','Soccer shoes','Shoes',1160,null,25,true,false),
('GP11 Shooter USB Gamepad','gp11-shooter-usb-gamepad','USB game controller','Gaming',660,null,25,true,false),
('Quilted Satin Jacket','quilted-satin-jacket','Satin jacket','Clothing',160,null,25,true,false)
on conflict (slug) do nothing;

select count(*) as products_count, coalesce(sum(stock), 0) as total_stock
from public.products
where archived = false;
