import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NavParams, PopoverController } from '@ionic/angular';
import * as THREE from 'three';

import { Cell } from '@models';

@Component({
  selector: 'event-attack',
  templateUrl: 'event-attack.component.html',
  styleUrls: ['event-attack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventAttackComponent implements AfterViewChecked, AfterViewInit, OnDestroy {
  @ViewChild('background', { static: true })
  background: ElementRef;
  cell: Cell;

  private animationId: number;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cloudParticles: THREE.Mesh[] = [];
  private monsterLevel1Image = 'assets/img/map/event-attack-monster-1.png';
  private monsterLevel2Image = 'assets/img/map/event-attack-monster-2.png';
  private monsterBossImage = 'assets/img/map/event-attack-monster-boss.png';
  private frogImage = 'assets/img/animations/smoke-1.png';

  get monstersLevel1(): string[] {
    return Array<string>(Math.min(5, this.cell.mosterLevel1Count)).fill(this.monsterLevel1Image);
  }
  get monstersLevel2(): string[] {
    return Array<string>(Math.min(5, this.cell.mosterLevel2Count)).fill(this.monsterLevel2Image);
  }
  get existsBoss(): boolean {
    return this.cell.doesBossExists;
  }

  constructor(
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private params: NavParams,
    private popoverController: PopoverController,
    private renderer2: Renderer2,
    private router: Router
  ) {
    this.cell = this.params.get('cell');
    console.log(this.cell);
  }

  ngAfterViewInit() {
    this.init();
    this.createFrog();
  }

  ngAfterViewChecked() {
    this.resizeCanvasToDisplaySize();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }

  private init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 1;
    this.camera.rotation.x = 1.16;
    this.camera.rotation.y = -0.12;
    this.camera.rotation.z = 0.27;
    const ambient = new THREE.AmbientLight(0x555555);
    this.scene.add(ambient);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.fog = new THREE.FogExp2(0x03544e, 0.001);
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer2.appendChild(this.background.nativeElement, this.renderer.domElement);

    this.ngZone.runOutsideAngular(() => {
      this.render();
    });
  }

  private render() {
    console.log('render');
    this.cloudParticles.forEach(p => {
      p.rotation.z -= 0.003;
    });
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => {
      this.render();
    });
  }

  private createFrog() {
    const loader = new THREE.TextureLoader();
    loader.load(this.frogImage, texture => {
      const cloudGeo = new THREE.PlaneBufferGeometry(1000, 1000);
      const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
      });

      for (let p = 0; p < 10; p++) {
        const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(Math.random() * 800 - 400, 500, Math.random() * 500 - 500);
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 2 * Math.PI;
        (cloud.material as THREE.Material).opacity = 0.55;
        this.cloudParticles.push(cloud);
        this.scene.add(cloud);
      }
    });
  }

  private resizeCanvasToDisplaySize() {
    const canvas = this.renderer.domElement;
    const width = this.background.nativeElement.clientWidth;
    const height = this.background.nativeElement.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
      this.renderer.setSize(width, height, true);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  close() {
    this.popoverController.dismiss();
  }
  attack() {
    this.popoverController.dismiss().then(() => {
      this.router.navigateByUrl('/battle', { state: { cell: this.cell } });
    });
  }
}
