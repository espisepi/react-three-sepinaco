import { Object3D, Vector3, Group, Mesh, LineSegments, BufferGeometry, CylinderGeometry, SphereGeometry, Matrix4, MathUtils } from 'three';

//import { Geo } from './base/Geo.js';
import { Colors } from './base/Mat.js';

import { Item } from '../core/Item.js';
import { Num, WithMassCenter } from '../core/Config.js';
//import { Basic3D } from '../core/Basic3D.js';
import { Instance } from '../core/Instance.js';
import { MathTool, PI90, todeg } from '../core/MathTool.js';
import { Quaternion } from '../core/MiniMath.js';

import { SphereBox, Capsule, ChamferCyl, ChamferBox, createUV, Stair  } from './geometries/Geometry.js';
import { CapsuleHelper } from './geometries/CapsuleHelper.js';
import { ConvexGeometry } from './geometries/ConvexGeometry.js';



let Geo = null;
let Mat = null;

const _up = /*@__PURE__*/ new Vector3(0,1,0);
const _right = /*@__PURE__*/ new Vector3(1,0,0);
const _forward = /*@__PURE__*/ new Vector3(0,0,1);

// THREE BODY

export class Body extends Item {

	constructor ( motor ) {

		super()

		this.motor = motor;
		this.engine = this.motor.engine;
		this.Utils = this.motor.utils;

		Geo = this.motor.geo
		Mat = this.motor.mat

		this.type = 'body';
		this.num = Num[this.type];
		this.full = false;
		//this.extraConvex = false;
		this.needMatrix = this.engine ==='RAPIER' || this.engine ==='HAVOK';
		//this.tmpVolume = 0

	}

	setFull( full ){

		this.num = Num[ full ? 'bodyFull':'body' ];
		this.full = full;
		
	}

	step (AR, N) {

		const list = this.list;
		let i = list.length, b, n, a, vv;
		
		while( i-- ){

			b = list[i];
			//b.id = i;

			if( b === null ) continue;

			n = N + ( i * this.num );

			// update only when physics actif buggy
			if( !b.actif ){
				// a = MathTool.nullArray( AR, n, this.num );
				//a = AR[n+0]+AR[n+1]+AR[n+2]+AR[n+3]+ AR[n+4]+AR[n+5]+AR[n+6]+AR[n+7];
				//if( a === 0 ) continue
				//if( MathTool.nullArray( AR, n, this.num ) === 0 ) continue;
				//else 
				b.actif = true;
				continue;
			}

		    // test is object sleep
			b.sleep = AR[n] > 0 ? false : true;

			// update default material
	        if( b.defMat ){

	        	if( b.isInstance ){
	        		b.instance.setColorAt( b.idx, b.sleep ? Colors.sleep : Colors.body )
	        	} else {
	        		if ( !b.sleep && b.material.name === 'sleep' ) b.material = Mat.get('body')
			        if ( b.sleep && b.material.name === 'body' ) b.material = Mat.get('sleep')
	        	}
			    
			}

			if( b.sleep && !b.isKinematic ) continue; 

			

			// update position / rotation

			b.position.fromArray( AR, n + 1 );
	        b.quaternion.fromArray( AR, n + 4 );

	        if(this.motor.ws !== 1) b.position.multiplyScalar(this.motor.uws)

	        // update velocity

	        if( this.full ){
		        b.velocity.fromArray( AR, n + 8 );
		        b.angular.fromArray( AR, n + 11 );
		    } else {
	    		if( b.getVelocity ){
	    			vv = this.motor.reflow.velocity[b.name];
	    			if(vv){
	    				b.velocity.fromArray(vv, 0 );
	    				b.angular.fromArray(vv, 3 );
	    			}
	    		}
	    	}

	    	//

	    	if( b.isInstance ){ 
		    	if( b.speedMat ){ 
		    		//b.instance.setColorAt( b.id, [ Math.abs(AR[n+8])*0.5, Math.abs(AR[n+9])*0.5, Math.abs(AR[n+10])*0.5] );
		    		let v = AR[n]*0.01///255; //MathTool.lengthArray([AR[n+8], AR[n+9], AR[n+10]]) * 0.062;
		    		b.instance.setColorAt( b.idx, [ v,v,v ] );
		    	}
		    	//b.instance.setTransformAt( b.idx, [AR[n+1],AR[n+2],AR[n+3]], [AR[n+4],AR[n+5],AR[n+6],AR[n+7]], b.noScale ? [1,1,1] : b.size );
		    	b.instance.setTransformAt( b.idx, b.position.toArray(), b.quaternion.toArray(), b.noScale ? [1,1,1] : b.size );
		    	if( this.needMatrix ) b.matrixWorld.compose( b.position, b.quaternion, {x:1, y:1, z:1}) 
		    	
		    } else { 

		        if( !b.auto ) b.updateMatrix();

		    }

		}

	}

	///

	geometry ( o = {}, b = null, material = null ) {

		let g, i, n, s = o.size, gName=''
		let t = o.type
		let noScale = false, unic = false;
		let seg = o.seg || 16;

		const noIndex = this.engine === 'OIMO' || this.engine === 'JOLT' || this.engine === 'AMMO' || this.engine === 'CANNON';

		//if( o.instance && t!== 'capsule'&& !o.radius) s = o.instanceSize || [1,1,1]

		if( o.instance && t === 'compound'){ 
			t = o.shapes[0].type
			s = o.shapes[0].size
			o.translate = o.shapes[0].pos;
		}

		if( t==='mesh' || t==='convex' ){
			if( o.shape ){
				if( o.shape.isMesh ) o.shape = o.shape.geometry;
			} else {
				if( o.mesh && !o.v ) o.shape = o.mesh.geometry;
			}	
		}

		if( o.radius ){
			//if( !o.breakable ){
				if( t === 'box' ) t = 'ChamferBox';
				if( t === 'cylinder' ) t = 'ChamferCyl';
			//}
		}

		if( o.geometry ){
			if( t === 'convex' ) o.shape = o.geometry;
			else t = 'direct';
		} 


	    if( this.engine === 'PHYSX' && o.type==='cylinder' ){
			// convert geometry to convex if not in physics
	    	let geom = new CylinderGeometry( o.size[ 0 ], o.size[ 0 ], o.size[ 1 ], seg, 1 );//24
	    	if( o.isWheel ) geom.rotateZ( -PI90 );
	    	o.v = MathTool.getVertex( geom )
	    	o.type = 'convex';

	    }

	    if( ( this.engine === 'PHYSX' || this.engine === 'HAVOK' || this.engine === 'JOLT' ) && o.type==='cone' ){
	    	// convert geometry to convex if not in physics
	    	//if( !o.size[2] ) o.size[2] = 0;
	    	//console.log(o.size[2])
	    	let geom = new CylinderGeometry( 0, o.size[ 0 ], o.size[ 1 ], seg, 1 );//24

	    	//o.size[2] = o.size[0]
	    	o.v = MathTool.getVertex( geom )
	    	o.type = 'convex';

	    }

	    if( o.type==='stair' ){
	    	o.type = 'box';
	    	t = 'box';
	    }

		switch( t ){

			case 'direct':

			    g = o.geometry.clone();
			    if( o.size ) g.scale( o.size[0], o.size[1], o.size[2] );

			    unic = true
			    noScale = true

			break;

			case 'convex':

				if( o.v ){ 

					if( o.nogeo ) g = new BufferGeometry();
					else {
						let vv = [];
						i = Math.floor( o.v.length/3 );
						while( i-- ){
							n = i*3;
							vv.push( new Vector3( o.v[n], o.v[n+1], o.v[n+2] ) )
						}
						g = new ConvexGeometry( vv );
						//o.v = math.getVertex( g )
						//o.index = math.getIndex( g )
						//console.log(o.v, o.index)
					}
					unic = true;
					noScale = true;
				}

				if( o.shape ){

					g = o.shape.clone();
					if( o.size ) g.scale( o.size[0], o.size[0], o.size[0] );
					if( o.shapeScale ) g.scale( o.shapeScale[0], o.shapeScale[1], o.shapeScale[2] );

					let tg = noIndex ? MathTool.toNonIndexed(g) : null;
					o.v = MathTool.getVertex( tg || g, noIndex );
					o.index = MathTool.getIndex( tg || g, noIndex );
					if(this.engine === 'CANNON'){ 
						// cannon is too slow with convex !!!
						// CannonJS requires CCW face indices ordering, else it detects
	                    // normals as pointing inwards
						 
						//console.log(tg)
						//o.faces = MathTool.getFaces( tg || g, noIndex );
						//o.normals = MathTool.getNormal( tg || g, noIndex );
					}

					unic = true;
					noScale = true;
				}

				if(!g.boundingBox) g.computeBoundingBox();
				let bx = g.boundingBox;
			    o.boxSize = [ -bx.min.x + bx.max.x, -bx.min.y + bx.max.y, -bx.min.z + bx.max.z ];

			    /*if(this.engine === 'PHYSX'){
					let center = new Vector3();
					MathTool.getCenter( g, center );
					if(!o.massCenter) o.massCenter = center.toArray();
					//console.log(o.massCenter)
				}*/

			break;

			case 'mesh':

				g = o.shape.clone();
				if( o.size ) g.scale( o.size[0], o.size[0], o.size[0] );
				
				o.v = MathTool.getVertex( g, noIndex );
				o.index = MathTool.getIndex( g, noIndex );

				//console.log(o.v, o.index)

				//console.log(o.index)

				/*let use16 = false;

				if(use16){
					let z = o.index.length;
					let index16 = new Uint16Array(z);
					while(z--){
						index16[z] = o.index[z];
					}
					o.index = index16;
				}*/

				if(this.engine === 'PHYSX'){
					let center = new Vector3();
					MathTool.getCenter( g, center );
					if(!o.massCenter) o.massCenter = center.toArray();
					//console.log(o.massCenter)
				}
				
				
				unic = true;
				noScale = true;
			
			break;

			case 'customSphere':

			    gName = 'customSphere_' + s[ 0 ];

			    g = Geo.get( gName );
			    if(!g){
			    	g = new SphereGeometry( s[ 0 ], o.seg1 || 32, o.seg2 || 16 );
					g.name = gName
			    } else {
					gName = ''
				}
			    noScale = true;
			    o.type = 'sphere';

			break;

			case 'highSphere':

			    gName = 'highSphere_' + s[ 0 ];

			    g = Geo.get( gName );
			    if(!g){
			    	g = new SphereBox( s[ 0 ] );
					g.name = gName
			    } else {
					gName = ''
				}
			    noScale = true;
			    o.type = 'sphere';

			break;

			case 'capsule':

			    gName = 'capsule_' + s[ 0 ] +'_'+s[ 1 ] + '_' + seg; 

			    g = Geo.get( gName )
			    if(!g){
			    	//if( o.helper ) g = new CapsuleHelperGeometry( s[ 0 ], s[ 1 ] )
					//else 
					g = new Capsule( s[ 0 ], s[ 1 ], seg )
					g.name = gName
				} else {
					gName = ''
				}
				noScale = true;
			break;

			case 'ChamferBox':

			    gName = 'ChamferBox_' + s[ 0 ] +'_'+ s[ 1 ] +'_'+ s[ 2 ] + '_' + o.radius; 

			    //console.log(s, o.radius)
			    g = Geo.get( gName )
			    if(!g){
					g = new ChamferBox( s[ 0 ], s[ 1 ], s[ 2 ], o.radius );
					g.name = gName
				} else {
					gName = ''
				}
				noScale = true;
			break;

			case 'ChamferCyl':

			    gName = 'ChamferCyl_' + s[ 0 ] +'_'+ s[ 1 ] +'_'+ s[ 2 ] + '_' + o.radius + '_' + seg;

			    g = Geo.get( gName )
			    if(!g){
					g = new ChamferCyl( s[ 0 ], s[ 0 ], s[ 1 ], o.radius, seg );
					g.name = gName;
				} else {
					gName = ''
				}
				noScale = true;
			break;

			default:
			    if( !o.breakable ) g = Geo.get(t); //geo[ t ];
			    else {
			    	g = Geo.get(t).clone();
			    	g.scale( s[0], s[1], s[2] )
			    	unic = true
			    	noScale = true;
			    }
			break;

		}


		if( o.translate ) g.translate( o.translate[0], o.translate[1], o.translate[2])


		// clear untranspherable variable for phy
    	if( o.shape ) delete o.shape
    	if( o.geometry ) delete o.geometry


    	if ( g.attributes.uv === undefined || o.autoUV ){
				//console.log(o.shape)
				createUV(g, 'box', 5.0, o.pos, o.quat )
		}


    	// reuse complex geometry
    	if( gName !== '' ) Geo.set( g )

    	if( o.isWheel ){
    		g = g.clone()
    		g.rotateZ( -PI90 );
    		unic = true
    	}
    	
    	// unic geometry dispose on reset 
    	if( unic ) Geo.unic(g);

    	


    	if( b === null && material === null ){
    		g.noScale = noScale; 
    		return g
    	}

    	if( o.meshRemplace && o.debug ) material = Mat.get( 'debug' );
    	//if( o.debug ) material = Mat.get( 'debug' )
    	//if( o.helper ) material = Mat.get( 'hide' )

    	//if( o.instance ) return

    	//console.log( material.name )

		let m = new Mesh( g, material );

		if( o.button ) m.isButton = true;

		//if( o.helper ) m.add( new LineSegments( new CapsuleHelperGeometry( s[ 0 ], s[ 1 ] ),  Mat.get( 'line' ) ))
		if( o.helper ) {

			let hcolor = o.hcolor || [0.3,0.1,0.0];
			let hcolor2 = o.hcolor2 || [0.8,0.2,0.0];

			// TODO bug with character
			let hh = new CapsuleHelper( s[ 0 ], s[ 1 ]+(s[ 0 ]*2), false, Mat.get( 'liner' ), hcolor, hcolor2, true )
			m.add( hh );
			m.userData['helper'] = hh;

		}

		if( o.localRot ) o.localQuat = MathTool.quatFromEuler(o.localRot) //math.toQuatArray( o.localRot )
		if( o.localPos ) m.position.fromArray( o.localPos )
		if( o.localQuat ) m.quaternion.fromArray( o.localQuat )

    	if( !noScale ) m.scale.fromArray( o.size )
    	//if( unic ) m.unic = true

    	// disable raycast
    	if(o.ray !== undefined){
    		if( !o.ray ) m.raycast = () => {return}
    	}

    	// add or not add
    	if( !o.meshRemplace || o.debug ){ 
    		b.add( m )
    		if(m.userData.helper) b.over = (b)=>{ m.userData.helper.over(b) }
    	}

	}

	add ( o = {} ) {

		if(o.worldScale){
			o = this.scaler( o, o.worldScale );
			delete o.worldScale;
		}

		//this.tmpVolume = 0

		//console.log('add', o.type )

		let i, n, name, volume = 0;

		if( !o.instance ) name = this.setName( o );

		o.type = o.type === undefined ? 'box' : o.type;

		if( o.type === 'plane' && !o.visible ) o.visible = false;

		if( o.type === 'stair'){ 

			let v1 = new Vector3(0,0,o.size[2]);
			let v2 = new Vector3(0, o.size[1]*0.5,o.size[2]*0.5);
			let angle = v1.angleTo(v2);
			let dist = v1.distanceTo(v2);
			o.rot = [angle * todeg,0,0];
			o.size[1] *= o.div || 0.2;
			o.size[2] = dist*2;
		
		    let p1 = new Vector3(0,-o.size[1]*0.5,0);
		    p1.applyAxisAngle({x:1, y:0, z:0}, angle);
			o.pos[1] += p1.y;
			o.pos[2] += p1.z;

		}


		// change default center of mass 
		// if engine don't have massCenter option
		// is convert to compound
		
		if( o.massCenter && WithMassCenter.indexOf(this.engine) ===-1 ){
			if( o.type !== 'compound' ){
				//o.localPos = o.massCenter
				o.shapes = [{ type:o.type, pos:o.massCenter, size:o.size }];
				if( o.seg ) o.shapes[0].seg = o.seg;
				if( o.radius ) o.shapes[0].radius = o.radius;
				delete o.size; // ?? TODO
				o.type = 'compound';
			} else {
				for ( i = 0; i < o.shapes.length; i ++ ) {
					n = o.shapes[ i ]
					if( n.pos ) n.pos = MathTool.addArray( n.pos, o.massCenter );
					else n.pos = o.massCenter;
					//Geo.unic(n);

				}
			}
		}

		if( o.collision !== undefined ){
			if(o.collision === false){
				if( this.engine === 'PHYSX' ) o.flags = 0
				if( this.engine === 'OIMO' ) o.mask = 0
				//o.mask = 0
			}
			
		}

		//----------------------------
		//  Position, Rotation, Size
		//----------------------------

		o.pos = o.pos === undefined ? [ 0, 0, 0 ] : o.pos;

		// rotation is in degree or Quaternion
	    o.quat = o.quat === undefined ? [ 0, 0, 0, 1 ] : o.quat;
	    // convert euler degree to Quaternion
	    if( o.rot !== undefined ) o.quat = MathTool.quatFromEuler(o.rot);
	    if( o.meshRot !== undefined ) o.meshQuat = MathTool.quatFromEuler(o.meshRot);

	    //o.size = o.size == undefined ? [ 1, 1, 1 ] : math.correctSize( o.size );
	    o.size = MathTool.autoSize( o.size, o.type );
	    if( o.meshScale ) o.meshScale = MathTool.autoSize( o.meshScale );


	    //--------------------
		//  Material
		//--------------------

	    let material, noMat = false;

	    if( o.visible === false ) o.material = 'hide'

	    if ( o.material !== undefined ) {
	    	if ( o.material.constructor === String ) material = Mat.get( o.material );
	    	else material = o.material;
	    } else {
	    	noMat = true;
	    	//defMat = this.type === 'body'
	    	material = Mat.get( this.type );
	    	if( o.instance ) material = Mat.get( 'base' );
	    }

	    if( o.unicMat ) {
	    	material = material.clone();
	    	Mat.addToTmp( material );
	    }


	    //--------------------
		//  Define Object
		//--------------------

	    let b = o.instance ? {} : new Object3D();// new Basic3D();

	    if( o.mesh && !o.instance ){

	    	//if( o.isTerrain ) o.noClone = true
	    	if( o.mesh.type === 'terrain' ) o.noClone = true;

	    	let mm = o.noClone ? o.mesh : o.mesh.clone()

	    	mm.position.fromArray( o.meshPos || [0,0,0]);
	    	//if( o.meshRot ) { o.meshQuat = MathTool.quatFromEuler(o.meshRot); delete o.meshRot; }
	    	if( o.meshQuat ) mm.quaternion.fromArray( o.meshQuat );
	    	if( o.meshSize ) mm.scale.set(1,1,1).multiplyScalar(o.meshSize);
	    	if( o.meshScale ) mm.scale.fromArray( o.meshScale );
	    	
	    	if( !noMat ){ 
	    		mm.material = material;
	    		if(mm.children && !o.nofullmat ) for(let k in mm.children) mm.children[k].material = material
	    	}

	    	this.motor.tmpMesh.push(mm);

	    	o.meshRemplace = true;
	    	b.add( mm );

	    }

	    //--------------------
		//  Define Geometry
		//--------------------

	    switch( o.type ){

	    	case 'null': break;

	    	case 'compound':

	    	    for ( i = 0; i < o.shapes.length; i ++ ) {

					n = o.shapes[ i ];

					n.type = n.type === undefined ? 'box' : n.type;
					//n.size = n.size === undefined ? [ 1, 1, 1 ] : math.correctSize( n.size );
					n.size = MathTool.autoSize( n.size, n.type );

					if( n.pos ) n.localPos = n.pos;
					if( n.rot !== undefined ) n.quat = MathTool.quatFromEuler(n.rot);
					if( n.quat ) n.localQuat = n.quat;
					
					n.debug = o.debug;
					n.meshRemplace = o.meshRemplace || false;

					if( !o.instance ) this.geometry( n, b, material );
					else if( n.type === 'convex' ){ 
				    	n.v = MathTool.getVertex( n.shape, false );
				    }
					volume += MathTool.getVolume( n.type, n.size, n.v );
					//console.log(n.type, n.size)

				}

				//console.log(volume, name)

	    	break;
	    	default:

			    if( !o.instance ) this.geometry( o, b, material );
			    // TODO fix that 
			    else if( o.type === 'convex' ){ 
			    	o.v = MathTool.getVertex( o.shape, false );
			    }
			    // TODO bug with instance !!!
			    //else o.size = MathTool.autoSize( o.size, o.type );
			    volume = MathTool.getVolume( o.type, o.size, o.v );

			break;

	    }



	    
	    b.type = this.type;
	    b.size = o.size;
		b.shapetype = o.type;
		b.isKinematic = o.kinematic || false;
		b.link = 0;

		b.meshSize = o.meshSize ? o.meshSize : 1;

		b.velocity = new Vector3();
		b.angular = new Vector3();

		b.sleep = o.sleep || false
		b.defMat = false;

		// for buttton only
		if( o.button ) b.isButton = true

	    // enable or disable raycast
	    b.isRay = o.ray !== undefined ? o.ray : true;



	    //b.type === 'body' || b.isButton ? true : false
	    //if( o.ray !== undefined ){ 
	    //	b.isRay = o.ray;

	    	//b.setRaycast( o.ray )
	    //}
	    //if( !o.instance ) b.setRaycast()


	    
		
		if( b.material && noMat ) b.defMat = b.material.name === 'body'


	    //--------------------
		//  Instance
		//--------------------

		if( o.instance ){ 

			b.isInstance = true;
			b.instance = this.getInstance( o, material );
			b.instance.isRay = b.isRay;

			b.over = b.instance.over;
			b.isRay = false
			b.isOver = false;

			b.speedMat = o.speedMat || false

			b.defMat = b.instance.material.name === 'base';
			
			b.idx = b.instance.count;
			//b.unicId = MathUtils.generateUUID();

			//b.mass = o.mass || 0

			//b.refName = b.instance.name + b.id;
			b.name = o.name ? o.name : b.instance.name + b.idx;
			o.name = b.name;

			b.noScale = b.instance.noScale;//false//o.type!=='box' || o.type!=='ChamferBox' || o.type!=='sphere';
			if(o.sizeByInstance) b.noScale = false;
			//if(o.type === 'sphere') b.noScale = false
		    //if( o.type === 'capsule' ) b.noScale = true
		    //if( o.type === 'box' ) b.noScale = true
			//if(o.radius) b.noScale = true

			let color = o.color;
			if( b.defMat ) color = o.sleep ? Colors.sleep : Colors.body;

			b.instance.add( b, o.pos, o.quat, b.noScale ? [1,1,1] : b.size, color );

			
			b.position = new Vector3().fromArray(o.pos); //{x:o.pos[0], y:o.pos[1], z:o.pos[2]};
			b.quaternion = new Quaternion().fromArray(o.quat); //{_x:o.quat[0], _y:o.quat[1], _z:o.quat[2], _w:o.quat[3]};

			
		    
		    //b.link = 0;
		    if( this.needMatrix ) b.matrixWorld = new Matrix4();

			// for convex
			if(b.instance.v) o.v = b.instance.v;
			if(b.instance.index) o.index = b.instance.index;
		    o.type = b.instance.type;


		    // skip first frame to force good repositionning on delete !
		    b.actif = false

			/*if( this.extraConvex && ( o.type==='cylinder' || o.type==='cone') ){
		    	o.v = b.instance.v;
		    	o.type = 'convex';
		    }*/


			//console.log( b )

		} else {

			b.name = name;

			if(!b.isRay){
				b.traverse( function ( node ) {
					if( node.isObject3D ) node.raycast = () => {return}
				})
			}

			if( o.renderOrder ) b.renderOrder = o.renderOrder;
			if( o.visible === undefined ) o.visible = true;
			if( o.shadow === undefined ) o.shadow = o.visible;

			b.dispose = function(){
		    	if(this.clearOutLine) this.clearOutLine();
		    	this.traverse( function ( node ) {
					if( node.isMesh && node.unic ) node.geometry.dispose();
				})
				this.children = [];
		    }.bind(b)

			b.visible = o.visible !== undefined ? o.visible : true;

			Object.defineProperty(b, 'material', {
				get() {
				    if( this.children[0] ) return this.children[0].material;
				    else return null;
				},
				set(value) {
				    this.traverse( function ( node ) { if( node.isMesh && node.name !== 'outline' ) node.material = value; })
				}
			});

			Object.defineProperty(b, 'castShadow', {
				get() {
				    if( this.children[0] ) return this.children[0].castShadow;
				    else return false;
				},
				set(value) {
				    this.traverse( function ( node ) { if( node.isMesh ) node.castShadow = value; })
				}
			});

			Object.defineProperty(b, 'receiveShadow', {
				get() {
				    if( this.children[0] ) return this.children[0].receiveShadow;
				    else return false;
				},
				set(value) {
				    this.traverse( function ( node ) { if( node.isMesh ) node.receiveShadow = value; })
				}
			});

		    b.receiveShadow = o.shadow;
		    b.castShadow = o.shadow;

		    if( this.motor.mouseActive ){

		    	b.overMaterial = Mat.get( 'outline' );
		    	b.isOver = false;

		    	// extra function to display wireframe over object

		    	b.addOutLine = function(){
		    		if( !this.children[0].isMesh ) return;
		    		this.outline = new Mesh().copy( this.children[0] );
					this.outline.name = "outline";
					this.outline.material = this.overMaterial;
					this.outline.matrixAutoUpdate = false;
					this.outline.receiveShadow = false;
					this.outline.castShadow = false;
					this.outline.raycast = () => ( false );
					this.add( this.outline );
		    	}.bind(b)

		    	b.clearOutLine = function(){
		    		if( !this.outline ) return;
					this.remove(this.outline);
					this.outline = null;
		    	}.bind(b)

		    	b.over = function(v){
		    		if( v && !this.isOver ) this.addOutLine();
			        if( !v && this.isOver ) this.clearOutLine();
			        this.isOver = v;
		    	}.bind(b)

		    	b.select = function(v){ }.bind(b)

		    }

		    

		    // apply option
			this.set( o, b );

		}




		//---------------------------
		//  Breakable
		//---------------------------

    	if( o.breakable ){

    		

    		let old = b;
			let child = old.children[0];
			old.remove(child);
			b = child;
			b.position.copy(old.position);
			b.quaternion.copy(old.quaternion);

			b.name = name;
			b.type = this.type;
			//b.density = o.density;
			b.breakable = true;
			b.breakOption = o.breakOption !== undefined ? o.breakOption : [ 250, 1, 2, 1 ];
			//b.getVelocity = true;

			b.ignore = o.ignore || [];

			///

			b.size = o.size;
			b.shapetype = o.type;
			b.isKinematic = o.kinematic || false;
			b.link = 0;

			b.meshSize = o.meshSize ? o.meshSize : 1;

			b.velocity = new Vector3();
			b.angular = new Vector3();

			b.sleep = o.sleep || false
			b.defMat = false;




			b.auto = o.auto || false;

		    if( !b.auto ) {
		    	b.matrixAutoUpdate = false;
			    b.updateMatrix();
			} else {
				b.matrixAutoUpdate = true;
			}
			
			//b.userData.mass = o.mass;
		}

		// for skeleton mesh

		/*if( o.bone ){

			b.userData.decal = o.decal;
            b.userData.decalinv = o.decalinv;
            b.userData.bone = o.bone;
		    

		    delete o.bone
		    delete o.decal
		    delete o.decalinv
		}*/

		//o.volume = this.tmpVolume

		//---------------------------
		//  Mass and Density
		//---------------------------

		b.mass = o.mass || 0;
		b.density = o.density || 0;

		if( b.density && !b.mass ) b.mass = MathTool.massFromDensity( b.density, volume );
		else if( b.mass && !b.density ){ 
			b.density = MathTool.densityFromMass( b.mass, volume );
			//  force density for engin don't have mass
			if( this.engine === 'RAPIER' || this.engine === 'OIMO'|| this.engine === 'PHYSX') o.density = b.density;
		}


		if( o.massInfo ) console.log( '%c'+b.name+ ' %c' + 'density:' + b.density + ' mass:'+ b.mass, "font-size:16px", "font-size:12px" );


		if( o.getVelocity ) b.getVelocity = true;

		//---------------------------
		// add to three world
		//---------------------------

		this.addToWorld( b, o.id );

		if( o.onlyMakeMesh ) return b;

		if( o.phySize ) o.size = o.phySize;
		if( o.phyPos ) o.pos = o.phyPos;

		//---------------------------
		//  Clear uneed object value
		//---------------------------

		if( o.rot ) delete o.rot;
		if( o.mesh ) delete o.mesh;
	    if( o.meshRot ) delete o.meshRot;
	    if( o.instance ) delete o.instance;
	    if( o.material ) delete o.material;
		if( o.parent ) delete o.parent;


		if( o.solver && this.engine === 'PHYSX' ){
			// physx only have mass for solver bone
			o.mass = b.mass;
			// keep name reference of bones
			const solver = this.byName( o.solver );
			solver.addBone( o.name );

		}

		if(o.sleep) this.set(o, b)

	    //---------------------------
		// send to physic engine 
		//---------------------------

		this.motor.post( { m:'add', o:o } );

		if( o.breakable ){ 

			let breaker = this.motor.getBreaker();
			breaker.add( b );
			// only add contact for first breakable 
			//if( b.name.search('_debris_') === -1 ) this.motor.add({ type:'contact', name:'cc_'+b.name,  b1:b.name, callback: null })
		}

		//---------------------------
		// return three object3d
		//---------------------------

		return b;

	}

	dispatchEvent( name, type, data ){

		let body = this.byName( name );
		body.dispatchEvent( { type:type, data:data } );

	}

	set ( o = {}, b = null ) {

		if( b === null ) b = this.byName( o.name );
		if( b === null ) return;

		if( o.getVelocity !== undefined ) b.getVelocity = o.getVelocity;

		if( b.isInstance ){

			if( o.pos ) b.position.fromArray(o.pos);// = {x:o.pos[0], y:o.pos[1], z:o.pos[2]}
		    if( o.quat ) b.quaternion.fromArray(o.quat);// = {_x:o.quat[0], _y:o.quat[1], _z:o.quat[2], _w:o.quat[3]};
			if( o.pos || o.quat ) b.instance.setTransformAt( b.idx, b.position.toArray(), b.quaternion.toArray(), b.noScale ? [1,1,1] : b.size );

		}else{

			if( o.pos ) b.position.fromArray( o.pos );
		    if( o.quat ) b.quaternion.fromArray( o.quat );

		    b.auto = o.auto || false;

		    if( !b.auto ) {
		    	b.matrixAutoUpdate = false;
			    b.updateMatrix();
			} else {
				b.matrixAutoUpdate = true;
			}
		}

	}

	getTransform( b ){

		if( typeof b === 'string' ) b = this.byName( o.name );
		if( b === null ) return;

		b.updateWorldMatrix( true, false );

		const e = b.matrixWorld.elements;

		//let q = b.quaternion;
		return {
			position:b.position.clone(),
			up: _up.clone().set( e[ 4 ], e[ 5 ], e[ 6 ] ).normalize(),//.applyQuaternion( q ),
			right: _right.clone().set( e[ 0 ], e[ 1 ], e[ 2 ] ).normalize(),//.applyQuaternion( q ),
			forward: _forward.clone().set( e[ 8 ], e[ 9 ], e[ 10 ] ).normalize()//.applyQuaternion( q ),
		}

	}

	clearInstance( name ){

		let instance = this.motor.instanceMesh[name];
		let bodyList = instance.getBodyList();

		this.motor.remove( bodyList );
		instance.dispose();
		delete this.motor.instanceMesh[name]

	}

	getInstance ( o, material ) {

		if( this.motor.instanceMesh[o.instance] ) return this.motor.instanceMesh[o.instance];

		// Create new instance 

		o = {...o};

		if( o.sizeByInstance ) o.size = [1,1,1];
		let g = this.geometry( o );

		if( o.mesh ) {
			if( !o.material && o.mesh.material ) material = o.mesh.material;
			g = o.mesh.isObject3D ? o.mesh.geometry.clone() : o.mesh.clone();
			if( o.meshSize ) g.scale( o.meshSize, o.meshSize, o.meshSize );
			if( o.meshScale ) g.scale( o.meshScale[0], o.meshScale[1], o.meshScale[2] );
			g.noScale = true;
		}

		let bb = new Instance( g, material, 0 );

		bb.type = o.type;
		bb.noScale = g.noScale;

		if( bb.type === 'convex' ) bb.v = o.v;
		if( o.index ) bb.index = o.index;
		

		//if( bb.type==='convex' ) bb.v = MathTool.getVertex( bb.geometry )

    	//bb.matrixAutoUpdate = false
    	//bb.instanceMatrix.setUsage( DynamicDrawUsage )
    	bb.receiveShadow = o.shadow !== undefined ? o.shadow : true;
    	bb.castShadow = o.shadow !== undefined ? o.shadow : true;

    	if( this.motor.mouseActive ) bb.overMaterial = Mat.get( 'outline' );

    	bb.name = o.instance;
		this.motor.scene.add( bb );
		this.motor.instanceMesh[ o.instance ] = bb;

		//console.log('add instance')

    	return bb;

	}

	scaler ( o, s ) {

	    if(o.size) o.size = math.worldscale(o.size, s )//o.size = math.scaleArray( o.size, s );
	    if(o.pos) o.pos = math.worldscale(o.pos, s )//o.pos = math.scaleArray( o.pos, s );
	    if(o.type === 'convex') o.shapeScale = [s,s,s];
	    if(o.shapes){
	        let i = o.shapes.length, sh;
	        while(i--){
	            sh = o.shapes[i];
	            if(sh.size) sh.size = math.scaleArray( sh.size, s );
	            if(sh.pos) sh.pos = math.scaleArray( sh.pos, s );
	            if(sh.type === 'convex') sh.shapeScale = [s,s,s];
	        }
	    }
	    if(o.mesh) o.meshScale = [s,s,s];
	    return o;

	}

}
