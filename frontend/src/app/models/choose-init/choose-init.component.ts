import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/projects/service/project.service';
import { ModelService } from 'src/app/services/model/model.service';

@Component({
  selector: 'app-choose-init',
  templateUrl: './choose-init.component.html',
  styleUrls: ['./choose-init.component.css']
})
export class ChooseInitComponent implements OnInit {

  constructor(
    public projectService: ProjectService,
    public modelService: ModelService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.modelService.init(params.project, params.model).subscribe()
    })
  }

}
