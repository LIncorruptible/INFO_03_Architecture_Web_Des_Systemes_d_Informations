import { Component } from '@angular/core';
import { Tag } from '../../../shared/models/Tag';
import { TagService } from '../../../services/tag.service';
import { MaterialService } from '../../../services/material.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})
export class TagsComponent {

  tags?: { tag: Tag, count: number }[];

  constructor(tagService: TagService, materialService: MaterialService) {
    tagService.getAll().subscribe(serverTags => {
      
      this.tags = serverTags.map(tag => {
        return { tag: tag, count: 0 };
      });

      this.tags.forEach(tag => {
        materialService.getByTag(tag.tag).subscribe(materials => {
          tag.count = materials.length;
        });
      });

    });
  }
}
