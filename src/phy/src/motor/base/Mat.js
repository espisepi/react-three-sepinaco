import {
    MeshPhongMaterial, MeshLambertMaterial, MeshStandardMaterial, MeshPhysicalMaterial, MeshBasicMaterial, 
    LineBasicMaterial, MeshToonMaterial, ShadowMaterial, ShaderMaterial,
    Matrix4, Euler, Quaternion, Vector3, Vector2, Matrix3, Color, NoColorSpace,
    AdditiveBlending, CustomBlending, NoBlending, NormalBlending, SubtractiveBlending, MultiplyBlending,
    AddEquation, SubtractEquation, ReverseSubtractEquation, MinEquation, MaxEquation,
    ZeroFactor, OneFactor, SrcColorFactor, OneMinusSrcColorFactor, SrcAlphaFactor, OneMinusSrcAlphaFactor, 
    DstAlphaFactor, OneMinusDstAlphaFactor, DstColorFactor, OneMinusDstColorFactor, SrcAlphaSaturateFactor,
    FrontSide, BackSide, DoubleSide, SRGBColorSpace
} from 'three';
import { CarbonTexture } from '../../3TH/textures/CarbonTexture.js';
import { MeshSssMaterial } from '../../3TH/materials/MeshSssMaterial.js';
//import { EnhanceShaderLighting } from '../../3TH/shaders/EnhanceShaderLighting.js';
//import { EnhanceLighting } from '../../3TH/shaders/EnhanceLighting.js';
//import { FakeGlowMaterial } from '../../3TH/materials/FakeGlowMaterial.js';


//-------------------
//
//  MATERIAL
//  https://physicallybased.info/
//
//-------------------

const matExtra = {

	//clearcoat:1.0,
	//clearcoatRoughness:0.1,
	metalness: 0.1,
	roughness: 0.9,
	//normalScale: new Vector2(0.25,0.25),

}

/*export const RealismLightOption = {
	enableESL:true,
	exposure:1,
	envMapIntensity:1,

	aoColor: new Color(0x000000),
	hemisphereColor: new Color(0xffffff),
    irradianceColor: new Color(0xffffff),
    radianceColor: new Color(0xffffff),

    aoPower: 9.7,//6,
    aoSmoothing: 0.26,
    aoMapGamma: 0.89,
    lightMapGamma: 0.9,//1,
    lightMapSaturation: 1,
    envPower: 1,//2
    roughnessPower: 1,//1.45,
    sunIntensity: 0,
    mapContrast: 1,//0.93,
    lightMapContrast: 1.03,
    smoothingPower: 0.76,
    irradianceIntensity: 6.59,
    radianceIntensity: 4.62,
    hardcodeValues: false

}*/

export const Colors = {
	grey:new Color( 0.180,0.180,0.180 ),//
	black:new Color( 0.039,0.039,0.039 ),//0.180,0.180,0.180
    body:new Color( 0xCAC6C3 ),//0xefefd4
    sleep:new Color( "hsl(33, 15%, 54%)" ),//0x9FBFBD
    solid:new Color( 0x6C6A68 ),//
    base:new Color( 0xc9c8c7 ),

    brick:new Color( 0.262,0.095,0.061 ),
    sand:new Color( 0.440,0.386,0.231 ),
    //black:new Color( "hsl(220, 8%, 15%)" ),
    gold:new Color( 0.944, 0.776, 0.373 ),
    gold2:new Color( 0.998, 0.981, 0.751 ),
    titanium: new Color(0.633,0.578,0.503),
    titaniumSpec: new Color(0.728,0.680,0.550),
    chrome: new Color(0.653,0.650,0.615),
    chromeSpec: new Color(0.675,0.720,0.711),
    copper:new Color( 0.988,0.688,0.448 ),
    carPaint:new Color( 0.1037792, 0.59212029, 0.85064936 ),
    clay:new Color( "hsl(12, 30%, 40%)" ),
    clayWhite:new Color( 0xa9a9a9 ),
    concrete:new Color( 0.510,0.510,0.510 ),

    Raw_Fire:new Color( "hsl(40, 18%, 54%)" ),
    Raw_Buff:new Color( "hsl(33, 15%, 54%)" ),
    Raw_Terracotta:new Color( "hsl(12, 30%, 40%)" ),
    Raw_Porcelain:new Color( "hsl(45, 15%, 90%)" ),

}

const ThreeVariable = {

	No: NoBlending,
	Normal: NormalBlending,
	Additive: AdditiveBlending,
	Subtractive: SubtractiveBlending,
	Multiply: MultiplyBlending,

	Eadd: AddEquation,
	Esub: SubtractEquation,
	Erev: ReverseSubtractEquation,
	Emin: MinEquation,
	Emaw: MaxEquation,

	Fzero: ZeroFactor,
	Fone:  OneFactor,
	Fcolor: SrcColorFactor,
	Fcolorm: OneMinusSrcColorFactor,
	Falpha: SrcAlphaFactor,
	Falpham: OneMinusSrcAlphaFactor,
	Fdstalpha: DstAlphaFactor,
	Fdstalpham: OneMinusDstAlphaFactor,
	Fdstcolor: DstColorFactor,
	Fdstcolorm: OneMinusDstColorFactor,
	Falphasaturate: SrcAlphaSaturateFactor, // ! not for destination

	Front: FrontSide,
	Back: BackSide,
	Double: DoubleSide,

};
/*
const addRenderMode = ()=>{

	let s = ShaderChunk.common;
	s = s.replace( '#define EPSILON 1e-6', `
		#define EPSILON 1e-6
		uniform int renderMode;
		uniform int depthPacking;
		varying vec2 vZW;
    `);
    ShaderChunk.common = s;

    ShaderChunk.clipping_planes_vertex = `
        #if NUM_CLIPPING_PLANES > 0
            vClipPosition = - mvPosition.xyz;
        #endif
        vZW = gl_Position.zw;
    `;

    s = ShaderChunk.dithering_fragment;
	s = s.replace( '#endif', `
		#endif

        #ifdef STANDARD

        if( renderMode == 1 ){ // depth render
            float fz = 0.5 * vZW[0] / vZW[1] + 0.5;
            fz=pow(fz, 10.0);
            gl_FragColor = depthPacking == 1 ? packDepthToRGBA( fz ) : vec4( vec3( 1.0 - fz ), opacity );
        }
        if( renderMode == 2 ) gl_FragColor = vec4(  packNormalToRGB( normal ), opacity );// normal render
        //if( renderMode == 3 ) gl_FragColor = vec4(  shadowColor, opacity );// normal render

        #else

        if( renderMode != 0 ) discard;

        #endif
    `);
    ShaderChunk.dithering_fragment = s;


}*/

export class Mat {

	constructor(){

		this.renderMode = { value: 0 };
		this.depthPacking = { value: 0 };
		this.extendMat = false

		this.isRealism=false;
		this.realismOption={};
		this.envMapIntensity=1.0;

		this.mat = {};
		this.TmpMat = [];

	}

	changeRenderMode (n) {

		this.renderMode.value = n;

	}

	initExtandShader () {
		//addRenderMode()
		//this.extendMat = true;
	}
	

	useRealLight (o) {

		/*this.isRealism = true;

		// apply color setting number
		for(let c in o){
			if(c.search('Color')!==-1){
				if(!o[c].isColor){
					RealismLightOption[c].set( o[c] );
					delete o[c];
				}
			} 
		}

		this.realismOption = { ...RealismLightOption, ...o };*/

	}

	setColor( o ) {

		/*if(!this.isRealism) return;

		//console.log(o)

		RealismLightOption.aoColor.set(o.minLuma).convertLinearToSRGB()
		RealismLightOption.hemisphereColor.set(o.maxLuma).convertLinearToSRGB()
		RealismLightOption.irradianceColor.set(o.sun).convertLinearToSRGB()
		RealismLightOption.radianceColor.set(o.vibrant).convertLinearToSRGB()*/

	}

	set( m, direct, beforeCompile = null ) {

		if(!beforeCompile) beforeCompile = m.onBeforeCompile;
		//if(!direct) this.extendShader( m, beforeCompile );
		this.mat[m.name] = m;

	}

	extendShader( m, beforeCompile = null ) { 

		//let oldCompile = null;
		//if( m.onBeforeCompile ) oldCompile = m.onBeforeCompile;

		/*if( this.isRealism ){
			m.onBeforeCompile = function ( shader ) {
				//shader.uniforms.renderMode = this.renderMode;
				//shader.uniforms.depthPacking = this.depthPacking;

				EnhanceLighting( shader, this.realismOption );
		        m.userData.isRealism = true;
		        m.userData.shader = shader;
	            if( beforeCompile ) beforeCompile( shader );
	        }

		} else {
			m.onBeforeCompile = function ( shader ) {

				shader.uniforms.renderMode = this.renderMode;
				shader.uniforms.depthPacking = this.depthPacking;

	            if( beforeCompile ) beforeCompile( shader );
	            m.userData.shader = shader;
	        }
		}*/
		
	}

	addToTmp( m ) {

		this.TmpMat.push( m );

	}

	create( o ) {

		let m, beforeCompile = null;

		if( o.isMaterial ){
			m = o;
		} else {

			let type = o.type !== undefined ? o.type : 'Standard'
			if( o.type ) delete o.type

			//if( !o.shadowSide ) o.shadowSide = 'double'

			beforeCompile = o.beforeCompile || null
		    if( o.beforeCompile ) delete o.beforeCompile;

			if( o.thickness || o.sheen || o.clearcoat || o.transmission || o.specularColor ) type = 'Physical';

			if(o.normalScale){
				if( !o.normalScale.isVector2 ) o.normalScale = new Vector2().fromArray(o.normalScale)
			}

		    if( o.side ) o.side = this.findValue( o.side );
		    if( o.shadowSide ) o.shadowSide = this.findValue( o.shadowSide );
		    if( o.blending ) o.blending = this.findValue( o.blending );
		    if( o.blendEquation ) o.blendEquation = this.findValue( o.blendEquation );
		    if( o.blendEquationAlpha ) o.blendEquationAlpha = this.findValue( o.blendEquationAlpha );
		    if( o.blendSrc ) o.blendSrc = this.findValue( o.blendSrc );
		    if( o.blendDst ) o.blendDst = this.findValue( o.blendDst );
		    if( o.blendDstAlpha ) o.blendDstAlpha = this.findValue( o.blendDstAlpha );
		    if( o.blendSrcAlpha ) o.blendSrcAlpha = this.findValue( o.blendSrcAlpha );

		    if(o.clearcoatNormalScale){
				if( !o.clearcoatNormalScale.isVector2 ) o.clearcoatNormalScale = new Vector2().fromArray( o.clearcoatNormalScale )
			}

		    type = type.toLowerCase();

		    switch( type ){

				case 'physical': 
					m = new MeshPhysicalMaterial( o ); 
					m.defines = {
						'STANDARD': '',
						'PHYSICAL': '',
						'USE_UV':'',
						'USE_SPECULAR':''
					}
				break;
				case 'phong': m = new MeshPhongMaterial( o ); break;
				case 'lambert': m = new MeshLambertMaterial( o ); break;
				case 'basic': m = new MeshBasicMaterial( o ); break;
				case 'line': m = new LineBasicMaterial( o ); break;
				case 'toon': m = new MeshToonMaterial( o ); break;
				case 'shadow': m = new ShadowMaterial( o ); break;
				case 'sss': m = new MeshSssMaterial( o ); break;
				default: m = new MeshStandardMaterial( o ); break;

			}

			///Mat.upEnvmapIntensity( m );

		} 

		if( this.mat[ m.name ] ) return null;
	    this.set( m, false, beforeCompile );
		return m;

	}

	findValue(v) { 
		return v === 'string' ? ThreeVariable[ v.charAt(0).toUpperCase() + v.slice(1) ] : v 
	}

	addToMat( o ) {

		if( this.isRealism ){
			for(let m in o){
				//o[m].shadowSide = DoubleSide;
				o[m].onBeforeCompile = function ( shader ) {
		            EnhanceLighting( shader, this.realismOption );
		            o[m].userData.isRealism = true;
		            o[m].userData.shader = shader;
		        }
			}


		}

		this.mat = { ...this.mat, ...o }

	}

	changeType() {



	}

	directIntensity ( v ) {

		for( let name in this.mat ) {
		//	if( mat[name].envMapIntensity ) mat[name].envMapIntensity = v;
		}
		
	}

	
	getList () {

		let l = {...this.mat}
		const ignor = ['line', 'debug', 'hide', 'svg']
		let i = ignor.length;
		while(i--) delete l[ignor[i]];

		return l

	}

	get( name ) {

		if( !this.mat[name] ){
			//console.log(name)
			let m;
			switch( name ){

				case 'grey': m = this.create({name:'grey', color:Colors.grey, metalness: 0.0, roughness: 0.5 }); break
				case 'black':   m = this.create({ name:'black', color:Colors.black, metalness: 0, roughness: 0.5 }); break

				case 'body': m = this.create({name:'body', color:Colors.body, ...matExtra }); break
			    case 'sleep':  m = this.create({ name:'sleep', color:Colors.sleep, ...matExtra }); break//0x46B1C9
			    case 'solid':  m = this.create({ name:'solid', color:Colors.solid, ...matExtra }); break
			    case 'base':   m = this.create({ name:'base', color:Colors.base, ...matExtra }); break

			    case 'clay':  m = this.create({ name:'clay', color:Colors.clay, metalness: 0.1, roughness: 0.7 }); break
			    case 'clayWhite':  m = this.create({ name:'clayWhite', color:Colors.clayWhite, metalness: 0.1, roughness: 0.7 }); break

			    case 'concrete':  m = this.create({ name:'concrete', color:Colors.concrete, metalness: 0.0, roughness: 0.9 }); break
			    case 'brick':  m = this.create({ name:'brick', color:Colors.brick, metalness: 0.0, roughness: 0.6 }); break
			    case 'sand':  m = this.create({ name:'sand', color:Colors.sand, metalness: 0.0, roughness: 0.9 }); break

			    

			    

			    // metal
			    case 'chrome': m = this.create({ name:'chrome', color:Colors.chrome, specularColor:Colors.chromeSpec, metalness: 1, roughness:0.075 }); break
			    case 'silver': m = this.create({ name:'silver', color:0xAAAAAA, metalness: 0.8, roughness:0.22 }); break
			    case 'gold': m = this.create({ name:'gold', color:Colors.gold, specularColor:Colors.gold2, metalness: 1, roughness:0.02 }); break
			    case 'copper': m = this.create({ name:'copper', color:Colors.copper, metalness: 1, roughness:0.05 }); break
			    case 'titanium': m = this.create({ name:'titanium', color:Colors.titanium, metalness: 1.0, roughness:0, specularColor:Colors.titaniumSpec }); break


			    case 'carPaint': m = this.create({ name:'carPaint', color:Colors.carPaint, metalness: 0, anisotropy:new Vector2(0.5,0.5), roughness:0.4, clearcoat: 1.0, clearcoatRoughness: 0, }); break

				//case 'simple': m = this.create({ name:'simple', color:0x808080, metalness: 0, roughness: 1 }); break

				case 'carbon': m = this.create({ name:'carbon', map:new CarbonTexture(), normalMap:new CarbonTexture(true), clearcoat: 1.0, clearcoatRoughness: 0.1, roughness: 0.5 }); break
				case 'cloth': m = this.create({ name:'cloth', color:0x8009cf, roughness: 0.5, sheenColor:0xcb7cff, sheen:1, sheenRoughness:0.2 }); break


				//case 'clear':  m = new MeshStandardMaterial({ color:0xFFFFFF, metalness: 0.5, roughness: 0 }); break
				//case 'wood':   m = this.create({ name:'wood', color:0xe8c2a1, metalness: 0, roughness: 1 }); break
				
				//case 'hero':   m = new MeshStandardMaterial({ color:0x00FF88, ...matExtra }); break
				case 'skinny':   m = this.create({ name:'skinny', color:0xe0ac69, ...matExtra }); break
				
				case 'glass':  m = this.create({ name:'glass', color:0xFFFFff, transparent:true, roughness:0.02, metalness:0.0, side:DoubleSide, alphaToCoverage:true, premultipliedAlpha:true, transmission:1, clearcoat:1, thickness:0.01  }); break
				//case 'glassX':  m = this.create({ name:'glassX', color:0xeeeeee, transparent:false, opacity:1.0, roughness:0.03, metalness:0,  side:DoubleSide, transmission:1.0, clearcoat:1, clearcoatRoughness:0.0, thickness:0.02, ior:1.52, shadowSide:1, reflectivity:0.5, iridescence:0 }); break
				case 'glassX':  m = this.create({ name:'glassX', color:0xFFFFff,  alphaToCoverage:true, transparent:true, opacity:1.0, roughness:0.0, metalness:0, side:DoubleSide, transmission:1.0, clearcoat:1, clearcoatRoughness:0.0, thickness:0.05, ior:1.52, shadowSide:1, reflectivity:0.5, iridescence:0, specularIntensity: 1, specularColor: 0xffffff, }); break
				
				case 'plexi':  m = this.create({ name:'plexi', blending:AdditiveBlending, color:0x010101, transparent:true, opacity:0.7, reflectivity:0.3, metalness:0.6, roughness:0.1, clearcoat:0.2, clearcoatRoughness: 0.02, side:DoubleSide, alphaToCoverage:true, premultipliedAlpha:true }); break
				case 'plexi2':  m = this.create({ name:'plexi2', blending:AdditiveBlending, color:0x010101, transparent:false, opacity:0.7, reflectivity:0.3, metalness:0.6, roughness:0.1, clearcoat:0.2, clearcoatRoughness: 0.02, side:DoubleSide, alphaToCoverage:false, premultipliedAlpha:true }); break
				case 'glass2': m = this.create({ name:'glass2', color:0xEEEEEE, transparent:true, roughness:0, alphaToCoverage:true, opacity:0.3  }); break
				case 'glass3': m = this.create({ name:'glass3', color:0x000000, transparent:true, roughness:0, alphaToCoverage:true, opacity:0.4  }); break
				case 'glass_red': m = this.create({ name:'glass_red', color:0xFF0000, transparent:true, roughness:0, alphaToCoverage:true, opacity:0.8  }); break
				
				
				case 'car':   m = this.create({ name:'car', color:0x303030, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03, sheen: 0.5 }); break
				case 'carGlass':   m = this.create({ name:'carGlass', color: 0xffffff, metalness: 0, roughness: 0, transmission: 1.0, ior:1.52 }); break

				case 'outline': 
				//if( !this.mat[ 'outline' ] ) this.mat[ 'outline' ] = new FakeGlowMaterial();
				//m = this.mat[ 'outline' ]
				//m = this.create({ name:'outline', color:0xFFFFFF, type:'Basic', side:BackSide, toneMapped:false, wireframe:false }); 
				m = this.create({ name:'outline', color:0xFFFFFF, type:'Basic', side:BackSide, toneMapped:false, wireframe:true, transparent:true, opacity:0.25 }); 
				break
				case 'debug': m = this.create({ name:'debug', type:'Basic', color:0xF37042, wireframe:true, toneMapped: false, transparent:true, opacity:0.5 }); break
				//case 'debug': m = this.create({ name:'debug', color:0xF37042, wireframe:true, toneMapped: false, transparent:true, opacity:0.5 }); break
				
				//case 'debug2': m = this.create({ name:'debug2', type:'Basic', color:0x00FFFF, wireframe:true, toneMapped: false }); break
				//case 'debug3':  m = this.create({ name:'debug3', type:'Basic', color:0x000000, wireframe:true, transparent:true, opacity:0.1, toneMapped: false }); break
				//case 'shadows': m = this.create({ name:'shadows', type:'Basic', transparent:true, opacity:0.01 }); break

				//case 'simple': m = this.create({ name:'simple', type:'basic'  }); break

				case 'shadow': m = this.create({ name:'shadow', type:'shadow', color:0x000000, opacity:0.5 }); break


				case 'bones':  m = this.create({ name:'bones', color:0xfde7d6,  wireframe:true }); break
				case 'bones2':  m = this.create({ name:'bones2', type:'basic', color:0xdfc4a8, transparent:true, opacity:0.5, depthTest:true, depthWrite:false, alphaToCoverage:true }); break

				
				case 'button':  m = this.create({ name:'button', color:0xFF404B, ...matExtra }); break
				//case 'hide': m = new MeshBasicMaterial({ visible:false }); break

				case 'line':
				    m = this.create({ name:'line', type:'line', vertexColors: true, toneMapped: false })
			    break
			    case 'liner':
				    m = this.create({ name:'liner', type:'line', vertexColors: true, toneMapped: false, depthTest:true, depthWrite:true, alphaToCoverage:true })
			    break
				case 'hide':
				    m = this.create({ name:'hide', type:'basic', visible:false });
			    break
			    case 'particle':
				    m = this.create({ name:'particle', type:'basic', toneMapped: false, color:0xffff00, transparent:true, opacity:0.2 });
			    break
			    case 'svg':
				    m = this.create({ name:'svg', type:'basic', toneMapped:false, vertexColors:true, transparent:false, side:DoubleSide });
			    break

			}
			
		}

		return this.mat[name]

	}

	dispose() {

		this.isRealism = false;

		for(let m in this.mat){
			this.mat[m].dispose();
			delete this.mat[m];
		}

		let i = this.TmpMat.length;
		while( i-- ) { this.TmpMat[i].dispose(); }
		this.TmpMat = [];

	}

	upShader() {

		let option = this.realismOption;
		//if(!option.enable) option = 

		for( let name in this.mat ){

			const m = this.mat[name];
			const shader = m.userData.shader;

			for( let o in option ){

				
				// undate shader uniforme
				if(shader){ 
					/*if(o==='enable'){ 
						shader.defines.ENHANCE_SHADER_LIGHTING = option[o] ? "" : undefined;
						//console.log(shader.defines.ENHANCE_SHADER_LIGHTING)
					}*/
					if(shader.uniforms[o]!==undefined) shader.uniforms[o].value = option[o]; 
				}
				// update material option
				if( m[o] ) m[o] = option[o];
			}


		}

	}

}


/*const outliner = new ShaderMaterial({
    uniforms: {
        color: {type: 'c', value: new Color(0xFFFFFF) },
        power: {type: 'f', value: 0.01 },
    },
    vertexShader:`
        uniform float power;
        void main(){
            //vec3 pos = position + normal * power;
            vec3 pos = position + normalize( normal ) * power;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }
    `,
    fragmentShader:`
        uniform vec3 color;
        void main(){
           gl_FragColor = vec4( color, 0.1 );
        }
    `,
    side:BackSide,
    toneMapped: false,
    //wireframe:true,
    //transparent:true,
    //opacity:0.1,

});*/